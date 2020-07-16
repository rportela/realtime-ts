import JsonRpcError from "./JsonRpcError";

/**
 * When a rpc call is made, the Server MUST reply with a Response, except for in the case of Notifications.
 * The Response is expressed as a single JSON Object, with the following members:
 */
export default interface JsonRpcResponse {
  /**
   * A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0".
   */
  jsonrpc: string;

  /**
   * This member is REQUIRED on success.
   * This member MUST NOT exist if there was an error invoking the method.
   * The value of this member is determined by the method invoked on the Server.
   */
  result?: any;

  /**
   * This member is REQUIRED on error.
   * This member MUST NOT exist if there was no error triggered during invocation.
   * The value for this member MUST be an Object as defined in section 5.1.
   */
  error?: JsonRpcError;

  /**
   * An identifier established by the Client that MUST contain a String, Number, or NULL value if included.
   * The value SHOULD normally not be Null [1] and Numbers SHOULD NOT contain fractional parts.
   */
  id: string | number;
}
