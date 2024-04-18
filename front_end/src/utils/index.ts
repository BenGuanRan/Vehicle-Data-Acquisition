export const debounce = (targetFunction: (...args: any[]) => void, delay?: number) => {
    let timer: any = null;
    if (!delay) delay = 500;
    return (...args: any[]) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            targetFunction(...args);
        }, delay);
    }
}//节流

export const throttle = (fn: (...args: any[]) => void, delay: number) => {
    let flag = true;
    if (!delay) delay = 500;
    return (...args: any[]) => {
        if (!flag) {
            alert('操作过于频繁');
            return;
        }
        flag = false;
        setTimeout(() => {
            fn(...args);
            flag = true;
        }, delay);
    }
}//防抖

//检查一个string列表里面是否有重复的元素
//检查重复

export const hasDuplicate = (list: string[]) => {
    console.log("检查 list:" + list)
    return new Set(list).size !== list.length;
}