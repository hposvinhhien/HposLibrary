

const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))

function resizeImage(logoUrl, maxWidth = 400, maxHeight = 350) {
    return new Promise((resolve) => {
        let img = new Image()
        img.src = logoUrl
        img.onload = () => {
            let canvas = document.createElement('canvas')
            const MAX_WIDTH = maxWidth
            const MAX_HEIGHT = maxHeight
            let width = img.width
            let height = img.height

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width
                    width = MAX_WIDTH
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height
                    height = MAX_HEIGHT
                }
            }
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL())
        }
    })
}

function scaleBackGroundImage(logoUrl, maxWidth = 400, maxHeight = 400) {
   
        return new Promise((resolve) => {
            try{
                let img = new Image()
                img.src = logoUrl
                img.onload = () => {
                    
                    function removeBackGroundImage_get_W_Posittion(i,width ){
                        i = i/4
                        let goundNum = Math.floor(i/width);
                        let SubNum = goundNum * width
                        return i - SubNum
                    }
                    function removeBackGroundImage_get_H_Posittion(i,width ){
                        i = i/4
                        let goundNum = Math.floor(i/width);
                        return goundNum
                    }
        
                    let canvas = document.createElement('canvas')
                    const MAX_WIDTH = maxWidth
                    const MAX_HEIGHT = maxHeight
                    let width = img.width
                    let height = img.height
        
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height
                            height = MAX_HEIGHT
                        }
                    }
                    canvas.width = width
                    canvas.height = height
                    let ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0, width, height)
        
        
                    var imgd = ctx.getImageData(0, 0, width, height),
                    pix = imgd.data,
                    newColor = {r:1,g:1,b:1, a:1};
                    let longestW = 0;
                    let longestH = 0;
                    for (var i = 0, n = pix.length; i <n; i += 4) {
                        var r = pix[i],
                            g = pix[i+1],
                            b = pix[i+2];
                    
                        if(r == 255&& g == 255 && b == 255){
                        // Change the white to the new color.
                        
                        pix[i] = newColor.r;
                        pix[i+1] = newColor.g;
                        pix[i+2] = newColor.b;
                        pix[i+3] = newColor.a;
                        } else {
                            let x = removeBackGroundImage_get_W_Posittion(i,width)
                            let y = removeBackGroundImage_get_H_Posittion(i,width)
                            if(x> longestW){
                                longestW = x;
                            }
                            if(y> longestH){
                                longestH = y;
                            }
                        }
                    }
                    //ctx.putImageData(imgd, 0, 0, longestW, height);
                    let canvas2 = document.createElement('canvas')
                    canvas2.width = longestW
                    canvas2.height = longestH
                    let ctx2 = canvas2.getContext('2d')
                    ctx2.drawImage(img, 0, 0, width, height)
        
                    resolve(canvas2.toDataURL())
                }
                img.onerror = () =>{
                    resolve(null)
                }
            }catch{
                resolve(null)
            }
        })
   
}


////var array = [2, 3, 4, 5, 6, 7, 8];
////array.foreach(function (item) {
////    if (item > 4)
////        console.log(item)
////});
//5,6,7,8
function formatSelectorAsArray(val,attr) {
    var outVal = [];
    $(val).each(function (idx, el) {
        outVal.push($(this).attr(attr));
    });
    return outVal;
}

Array.prototype.foreach = function (iterator) {
    for (var i = 0, len = this.length; i < len; i++) {
        iterator && iterator(this[i]);
    }
}
//array.mapping(function (item) {
//    return item * item;
//});
Array.prototype.mapping = function (iterator) {
    var list = [];
    for (var i = 0, len = this.length; i < len; i++) {
        if (iterator)
            list.push(iterator(this[i]));
    }
    return list;
}
//array.remove(function (item) {
//    return item > 4;
//});
Array.prototype.remove = function (iterator) {
    for (var i = this.length; i >= 0; i--) {
        if (iterator && iterator(this[i]))
            this.splice(i, 1);
    }
}

function formatNumber(text) {
    return parseFloat(text).toFixed(2)
}
//await delay(100)
const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));

Array.prototype.Sum = function(cb) {
  const iterator = this[Symbol.iterator]();
  const iteration = iterator.next();
  return iterate(iteration, 0,cb);
  function iterate(iteration, intSum,cb) {
    if(iteration.value){
        intSum += (cb(iteration.value)*1||0);
        const nextIteration = iterator.next(iteration.value);
        return iterate(nextIteration, intSum,cb);
    } else {
        return Number((intSum).toFixed(3));
    }
  }
};




Array.prototype.GroupBy =  function(keyGetter) {
    const map = new Map();
    this.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
  }

  //array.updateObject('id', 2, { name: 'Updated Name' });
  Array.prototype.updateObject = function (predicate, updatedObject) {
    const ele = this
    ele.forEach(function (item,index){
        let tmpArr = [item];
        let checkItem = tmpArr.filter(predicate)
        if (checkItem.length > 0) {
            ele[index] = { ...ele[index], ...updatedObject };
        }
    })
    
  };
  
    //array.deleteObject(x=>x.rowid == item.rowid);
  Array.prototype.deleteObject = function (predicate) {
    const ele = this
    ele.forEach(function (item,index){
        let tmpArr = [item];
        let checkItem = tmpArr.filter(predicate)
        if (checkItem.length > 0) {
            ele.splice(index, 1);
        }
    })
  };
 Array.prototype.deleteObjectFirst = function (predicate) {
    const ele = this
     let isDelete = false;
    ele.forEach(function (item,index){
        let tmpArr = [item];
        let checkItem = tmpArr.filter(predicate)
        if (checkItem.length > 0 && isDelete == false) {
            ele.splice(index, 1); 
            isDelete = true;
        }
    })
  };
  async function taskRunner(fn, label) {
    const startTime = performance.now();
    console.log(`Task ${label} starting...`);
    let result = await fn();
    console.log(`Task ${label} finished in ${ Number.parseInt(performance.now() - startTime) } miliseconds with,`, result);
  }

  function generateRandomString(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // You can customize this character set
    let randomString = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset.charAt(randomIndex);
    }
  
    return randomString;
  }




var timerDebounce
const debounce = (mainFunction, delay) => {
  // Declare a variable called 'timer' to store the timer ID

  clearTimeout(timerDebounce);

    // Set a new timer that will execute 'mainFunction' after the specified delay
    timerDebounce = setTimeout(() => {
      mainFunction();
    }, delay);
};

const tryFunction = (tryfunc) => {
    try {
        tryfunc();
    } catch(err) {
        console.log(err)
    }
}

