/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CategoryDto {
  categoryId?: string;
  categoryName?: string;
}

export interface CreateCategoryRequestDto {
  categoryName?: string;
}

export interface UpdateCategoryRequestDto {
  categoryName?: string;
}

export interface UserDto {
  userId?: string;
  username?: string;
  role?: string;
}

export interface CreateUserRequestDto {
  password?: string;
  username?: string;
}

export interface LoginResponseDto {
  token?: string;
  user?: UserDto;
}

export interface LoginRequestDto {
  username?: string;
  password?: string;
}

export interface ProductDto {
  category?: CategoryDto;
  productId?: string;
  productName?: string;
  /** @format decimal */
  productPrice?: number;
  /** @format int32 */
  inventory?: number;
  categoryId?: string;
  sellerId?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:5000";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title My Title
 * @version 1.0.0
 * @baseUrl http://localhost:5000
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Category
     * @name CategoryGetCategories
     * @request GET:/api/Category
     * @secure
     */
    categoryGetCategories: (params: RequestParams = {}) =>
      this.request<CategoryDto[], any>({
        path: `/api/Category`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Category
     * @name CategoryCreateCategory
     * @request POST:/api/Category
     * @secure
     */
    categoryCreateCategory: (
      data: CreateCategoryRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<CategoryDto, any>({
        path: `/api/Category`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Category
     * @name CategoryUpdateCategory
     * @request PUT:/api/Category/{id}
     * @secure
     */
    categoryUpdateCategory: (
      id: string,
      data: UpdateCategoryRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<CategoryDto, any>({
        path: `/api/Category/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Category
     * @name CategoryDeleteCategory
     * @request DELETE:/api/Category/{id}
     * @secure
     */
    categoryDeleteCategory: (id: string, params: RequestParams = {}) =>
      this.request<Blob, any>({
        path: `/api/Category/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserCreateUser
     * @request POST:/api/User
     */
    userCreateUser: (data: CreateUserRequestDto, params: RequestParams = {}) =>
      this.request<UserDto, any>({
        path: `/api/User`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserLogin
     * @request POST:/api/User/login
     */
    userLogin: (data: LoginRequestDto, params: RequestParams = {}) =>
      this.request<LoginResponseDto, any>({
        path: `/api/User/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserMe
     * @request GET:/api/User/me
     * @secure
     */
    userMe: (params: RequestParams = {}) =>
      this.request<UserDto, any>({
        path: `/api/User/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  getProducts = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductGetProducts
     * @request GET:/GetProducts
     * @secure
     */
    productGetProducts: (
      query?: {
        /** @format int32 */
        page?: number;
        /** @format int32 */
        resultsPerPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProductDto[], any>({
        path: `/GetProducts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  mine = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductGetMyProducts
     * @request GET:/mine
     * @secure
     */
    productGetMyProducts: (params: RequestParams = {}) =>
      this.request<ProductDto[], any>({
        path: `/mine`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  createProduct = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductCreateProduct
     * @request POST:/CreateProduct
     * @secure
     */
    productCreateProduct: (
      query?: {
        ProductName?: string;
        /** @format decimal */
        ProductPrice?: number;
        /** @format int32 */
        Inventory?: number;
        CategoryId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProductDto, any>({
        path: `/CreateProduct`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  id = {
    /**
     * No description
     *
     * @tags Product
     * @name ProductUpdateProduct
     * @request PUT:/{id}
     * @secure
     */
    productUpdateProduct: (
      id: string,
      query?: {
        ProductName?: string;
        /** @format decimal */
        ProductPrice?: number;
        /** @format int32 */
        Inventory?: number;
        CategoryId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ProductDto, any>({
        path: `/${id}`,
        method: "PUT",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Product
     * @name ProductDeleteProduct
     * @request DELETE:/{id}
     * @secure
     */
    productDeleteProduct: (id: string, params: RequestParams = {}) =>
      this.request<Blob, any>({
        path: `/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
