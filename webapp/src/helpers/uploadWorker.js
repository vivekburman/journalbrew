const uploadFileOrURL = () => {
  onmessage = (e) => {
    const {file, token, baseURL, type } = e.data;
    const _formData = new FormData();
    _formData.append('media', file);

    fetch(`${baseURL}/api/post/upload-media/${type == 1 ? 'image' : 'video'}`, {
      method: 'POST',
      body: _formData,
      headers: {
        'Authorization': token,
      }
    })
    .then(res => res.json())
    .then((res) => {
      if (res.error && res.error.status == 401) {
        postMessage({
          "success": -1,
          "file": {
            "url": null,
            "key": null
          }
        });
      } else {
        res.success ?
        postMessage({
          "success": 1,
          "file": {
            "url": res.url,
            "key": res.key
          }
        }) : postMessage({
          "success": 0,
          "file": {
            "url": null,
            "key": null
          }
        });
      } 
    })
    .catch((e) => {
      postMessage({
        "success": 0,
        "file": {
          "url": null,
          "key": null
        }
      });
    });
  }
}
let code = uploadFileOrURL.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
const blob = new Blob([code], {type: "application/javascript"});
const workerScript = URL.createObjectURL(blob);
export default workerScript;