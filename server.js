const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const axios = require('axios');
const crypto = require('crypto');
const JSZip = require('jszip');

const app = express();
const PORT = process.env.PORT || 10000;

// الرابط الأساسي للسيرفر الأصلي للشركة لتمرير الطلبات إليه
const ORIGINAL_SERVER = "https://diagboss.ch";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 1. مسار التحميل وحقن الترخيص (Download & License Injection)
// ==========================================
app.get('/api/v2/download', async (req, res) => {
    const queryParam = req.query.versionDetailId || req.query.id || req.query.name || req.query.softPackageID;

    try {
        let cleanUrl = "";
        let softName = "software";

        // إذا كان رابط Firmware مباشر أو معرف خاص
        if (queryParam === '343730') {
            cleanUrl = `${ORIGINAL_SERVER}/api/v2/download?versionDetailId=343730&dzCode=Rm5VZXlFZFdLdEFuTDFJQUNjY2daZz09&serialNo=979862374489&token=Ti96b3B0MDFKdFNTNWFMT2NTbFlXUT09`;
            softName = "Firmware";
        } else {
            // جلب الرابط الحقيقي من السيرفر الأصلي بناءً على المعرف المطلوبة
            try {
                const checkRes = await axios.get(`${ORIGINAL_SERVER}/api/v2/download`, {
                    params: req.query,
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    responseType: 'json'
                });
                if (checkRes.data && checkRes.data.url) {
                    cleanUrl = checkRes.data.url;
                }
            } catch (e) {
                // في حال فشل الاستعلام المباشر، نحاول تمرير الرابط إذا وُجد في الـ Query
                cleanUrl = req.query.url || `${ORIGINAL_SERVER}/api/v2/download?${new URLSearchParams(req.query).toString()}`;
            }
        }

        if (!cleanUrl) {
            cleanUrl = `${ORIGINAL_SERVER}/api/v2/download?${new URLSearchParams(req.query).toString()}`;
        }

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            }
        };

        https.get(cleanUrl, options, (externalRes) => {
            if (externalRes.statusCode !== 200) {
                return res.status(externalRes.statusCode).end();
            }

            const chunks = [];
            externalRes.on('data', (chunk) => chunks.push(chunk));

            externalRes.on('end', async () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    
                    // محاولة فك ملف الـ ZIP وحقن الترخيص بداخله
                    const zip = new JSZip();
                    const loadedZip = await zip.loadAsync(buffer);

                    let targetFolderPath = "";
                    loadedZip.forEach((relativePath) => {
                        const match = relativePath.match(/^(.*\/V\d{2}\.\d{2})\//i);
                        if (match && match[1] && !targetFolderPath) {
                            targetFolderPath = match[1] + "/";
                        }
                    });

                    if (!targetFolderPath) {
                        loadedZip.forEach((relativePath) => {
                            const parts = relativePath.split('/');
                            for (let i = 0; i < parts.length; i++) {
                                if (/^V\d{2}\.\d{2}$/i.test(parts[i]) || /^V\d+/i.test(parts[i])) {
                                    targetFolderPath = parts.slice(0, i + 1).join('/') + '/';
                                    break;
                                }
                            }
                        });
                    }

                    const licensePath = targetFolderPath ? targetFolderPath + "LICENSE.DAT" : "LICENSE.DAT";
                    loadedZip.file(licensePath, ""); // حقن ملف ترخيص فارغ

                    const content = await loadedZip.generateAsync({ 
                        type: 'nodebuffer',
                        compression: "DEFLATE"
                    });

                    const fileHash = crypto.createHash('md5').update(content).digest('hex');

                    res.setHeader('code', '0');
                    res.setHeader('downloadid', queryParam || '0');
                    res.setHeader('sign', fileHash);
                    res.setHeader('ETag', `"${fileHash}"`);
                    res.setHeader('Content-Type', 'application/zip');
                    res.setHeader('Content-Disposition', `attachment; filename="${softName}.zip"`);
                    res.setHeader('Content-Length', content.length);
                    
                    return res.send(content);

                } catch (zipError) {
                    // إذا لم يكن الملف المضغوط بصيغة ZIP صالحة، أعده كما هو
                    res.setHeader('Content-Type', 'application/octet-stream');
                    return res.send(buffer);
                }
            });

        }).on('error', () => {
            return res.status(500).end();
        });

    } catch (error) {
        console.error("Download route error:", error);
        return res.status(500).end();
    }
});

// ==========================================
// 2. السيرفر الوسيط العام لباقي مسارات التطبيق (Reverse Proxy)
// ==========================================
app.all('/api/v2/*', async (req, res) => {
    try {
        const targetUrl = `${ORIGINAL_SERVER}${req.originalUrl}`;
        console.log(`Proxying ${req.method} request to: ${targetUrl}`);

        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: {
                ...req.headers,
                host: new URL(ORIGINAL_SERVER).host
            },
            responseType: 'arraybuffer',
            validateStatus: () => true // قبول جميع الستاتس كود من السيرفر الأصلي
        });

        // نسخ الهيدرات وإرسال الرد القادم من السيرفر الأصلي للتطبيق مباشرة
        res.set(response.headers);
        return res.status(response.status).send(response.data);

    } catch (error) {
        console.error("Proxy error:", error.message);
        return res.status(500).send("Proxy Server Error");
    }
});

// مسار افتتاحي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
    res.send("Diagzone Proxy Server is Running Successfully!");
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Proxy Server is running on port ${PORT}`);
});
