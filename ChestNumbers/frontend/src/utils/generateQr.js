import QRCode from "qrcode";

const baseOptions = {
  width: 180,
  margin: 2,
};

const normalizeData = (data) =>
  typeof data === "string" ? data : JSON.stringify(data);

export const generateDarkQr = async (data, options = {}) => {
  try {
    return await QRCode.toDataURL(normalizeData(data), {
      ...baseOptions,
      ...options,
      color: {
        dark: "#22BFF8",
        light: "#04132D",
      },
    });
  } catch (error) {
    console.error("Dark QR generation failed:", error);
    return "";
  }
};

export const generateLightQr = async (data, options = {}) => {
  try {
    return await QRCode.toDataURL(normalizeData(data), {
      ...baseOptions,
      ...options,
      color: {
        dark: "#020617",
        light: "#ffffff",
      },
    });
  } catch (error) {
    console.error("Light QR generation failed:", error);
    return "";
  }
};

export const generateQr = async (
  data,
  { darkMode = false, ...options } = {},
) => {
  return darkMode
    ? generateDarkQr(data, options)
    : generateLightQr(data, options);
};
