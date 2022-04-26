export { readFile, findValues }

function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = res => {
        resolve(res.target.result);
      };
      reader.onerror = err => reject(err);
  
      reader.readAsText(file);
    });
  }

  function findValues(obj, key){
    return findValuesHelper(obj, key, []);
  }
  
  function findValuesHelper(obj, key, list) {
    if (!obj) return list;
    if (obj instanceof Array) {
      for (let i in obj) {
          list = list.concat(findValuesHelper(obj[i], key, []));
      }
      return list;
    }
    if (obj[key]) list.push(obj[key]);
  
    if ((typeof obj === 'object') && (obj !== null) ){
      var children = Object.keys(obj);
      if (children.length > 0){
        for (let i = 0; i < children.length; i++ ){
            list = list.concat(findValuesHelper(obj[children[i]], key, []));
        }
      }
    }
    return list;
  }
  