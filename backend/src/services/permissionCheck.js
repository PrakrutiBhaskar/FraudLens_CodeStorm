export const analyzePermissions = (permissions = []) => {
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
    score: found.length > 0 ? 1 : 0,
    dangerousPermissions: found
  };
};

export const detectOverlayAbuse = (permissions = []) => {
  const overlayFlag = "android.permission.SYSTEM_ALERT_WINDOW";
  const hasOverlay = permissions.some(p => p.name === overlayFlag);

  return {
    overlayAbuse: hasOverlay
  };
};
