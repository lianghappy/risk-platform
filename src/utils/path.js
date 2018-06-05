import { PATHS } from 'utils/constants';

// 路由路径设置
export const setPath = (path) => (PATHS === '' ? path : `/${PATHS}${path}`);
// 路径过滤
export const filterPath = (path) => (PATHS === '' ? path : path.replace(new RegExp(`^/${PATHS}`), ''));
