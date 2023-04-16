// Error Code
export const E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
export const E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR =
  "E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR";
export const E_PERMISSION_MISSING = "E_PERMISSION_MISSING";
export const E_PICKER_NO_CAMERA_PERMISSION = "E_PICKER_NO_CAMERA_PERMISSION";
export const E_USER_CANCELLED = "E_USER_CANCELLED";
export const E_UNKNOWN = "E_UNKNOWN";
export const E_DEVELOPER_ERROR = "E_DEVELOPER_ERROR";
export const TIMEOUT_NETWORK = "ECONNABORTED"; // request service timeout
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";

//////////////// Localization Begin ////////////////
export const NETWORK_CONNECTION_MESSAGE =
  "Cannot connect to server, Please try again.";
export const NETWORK_TIMEOUT_MESSAGE =
  "A network timeout has occurred, Please try again.";
export const UPLOAD_PHOTO_FAIL_MESSAGE =
  "An error has occurred. The photo was unable to upload.";

export const YES = "YES";
export const NO = "NO";
export const OK = "ok";
export const NOK = "nok";

// export const apiUrl = "http://localhost:2008/api/patong/";
export const apiUrl = "https://asia-east1-patong-379114.cloudfunctions.net/Patong_backend/api/patong/";

export const apiName = {
  authen: {
    login: "authen/login",
    crypto : "authen/crypto",
    image: "authen/image",
  },
  users: {
    user: "users/user",
  },
  areas: {
    area: "areas/area",
  },
  products : {
    product : "products/product",
    image : "products/image",
    sugressionProductType: "products/sugressionProductType",
  },
  stocks : {
    findByStockName: "stocks/findByStockName",
    findByProductId: "stocks/findByProductId",
    stock: "stocks/stock",
    StocksTracking: "stocks/StocksTracking",
  },
  report : {
    stockByProduct: 'report/stockByProduct',
    productAndStockQty: 'report/productAndStockQty',
  }

};

export const key = {
  user_id: "user_id",
  username: "username",
  user_level: "user_level",
  token: "token",
  isLogined: "isLogined",
  loginTime: "loginTime",
  secretKey: "secretKey",
};
