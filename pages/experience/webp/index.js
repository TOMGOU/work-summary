/**
 * 判断浏览器是否支持webp格式
 */
function checkWebp() {
  try {
      return document.createElement('canvas')
          .toDataURL('image/webp')
          .indexOf('data:image/webp') === 0
  } catch (e) {
      return false
  }
}

const supportWebp = checkWebp();

export function getWebpImageUrl(url) {
  if (!url) {
      throw Error('url 不能为空');
  }

  if (url.startWith('data:')) {
      return url;
  }

  if (!supportWebp) {
      return url
  }

  return url + '?x-oss-processxxxxxxxxx'
}

// https://test-images-cdn.lxusercontent.com/used_car/image/g_zhongsheng/2021-12-22/4yBGWGpfFtNsTkcPqtgTa6.jpg?x-oss-process=image/format,webp

// https://test-images-cdn.lxusercontent.com/dealer_car_trade/info_image/d_770/2022-03-10/JeJt3wwN2BsFQCLeKEEcLh.jpg?x-oss-process=image/resize,w_800/quality,q_90
