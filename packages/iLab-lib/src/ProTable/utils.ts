/**
 * 将请求格式化成 pro-table 使用的 request 格式
 * @param {Function} method 调用请求
 * @param {Object} params 调用请求
 * @param {Function} method 重构列表数据
 * @return {Promise}
 */

interface RequestData {
  success: boolean;
  data?: any[];
  total: number;
}

export function formatTableRequest(
  method: any,
  params: { [x: string]: any },
  query?: { [x: string]: any } | undefined,
): Promise<RequestData> {
  return new Promise((resolve, reject) => {
    method(params, query)
      .then((res: any) => {
        const resList = res.data?.records || res.data || [];
        resolve({
          success: res.success,
          data: resList,
          total: res.data?.total || 0,
        });
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}

// 格式化请求分数数据
export function formatPaginationParams(
  params: {
    current?: number;
    pageSize?: number;
    [key: string]: any;
  } = { current: 1, pageSize: 10 },
) {
  const { current, ...rest } = params;
  return {
    ...rest,
    pageNum: current,
  };
}
