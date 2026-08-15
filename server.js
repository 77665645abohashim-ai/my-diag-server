لت<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <!-- السماح بشهادات النظام -->
            <certificates src="system" />
            <!-- السماح بشهادات المستخدم (لمراقبة واعتراض الاتصالات) -->
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>
