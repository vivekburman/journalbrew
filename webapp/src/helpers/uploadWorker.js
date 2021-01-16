const uploadFileOrURL = () => {
  onmessage = (e) => {
    const {fileOrURL, token, baseURL, type } = e.data;
    const _formData = new FormData();
    _formData.append('media', fileOrURL);

    fetch(`${baseURL}/api/post/upload-media/${type == 1 ? 'image' : 'video'}`, {
      method: 'POST',
      body: _formData,
      headers: {
        'Authorization': token,
      }
    })
    .then(res => res.json())
    .then((res) => {
      res.success ?
        postMessage({
          "success": 1,
          "file": {
            "url": res.url
          }
        }) : postMessage({
          "success": 0,
          "file": {
            "url": null
          }
        }); 
    })
    .catch(() => {
      postMessage({
        "success": 0,
        "file": {
          "url": null
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