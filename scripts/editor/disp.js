(function () {
  const ua = navigator.userAgent.toLowerCase();

  const isMobile =
    ua.includes("android") || ua.includes("iphone") || ua.includes("ipod");

  const isTablet =
    ua.includes("ipad") || (ua.includes("android") && !ua.includes("mobile"));

  if (isMobile || isTablet) {
    alert(
      "⚠️ Atención\n\n" +
        "Este editor está optimizado para ordenadores.\n\n" +
        "En dispositivos móviles o tablets algunas funciones pueden no funcionar correctamente.\n\n" +
        "Para una mejor experiencia, recomendamos usar un PC.",
    );
  }
})();
