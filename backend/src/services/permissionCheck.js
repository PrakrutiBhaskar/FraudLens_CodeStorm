export const analyzePermissions = (permissions = [], official = {}) => {
  const dangerous = [
    "android.permission.SYSTEM_ALERT_WINDOW",
    "android.permission.BIND_ACCESSIBILITY_SERVICE",
    "android.permission.READ_SMS",
    "android.permission.RECEIVE_SMS",
    "android.permission.SEND_SMS",
    "android.permission.READ_CONTACTS",
    "android.permission.QUERY_ALL_PACKAGES",
    "android.permission.WRITE_SETTINGS",
    "android.permission.REQUEST_INSTALL_PACKAGES"
  ];

  const found = permissions
    .map(p => p.name)
    .filter(p => dangerous.includes(p));

  return {
    dangerousCount: found.length,
    dangerousPermissions: found
  };
};
