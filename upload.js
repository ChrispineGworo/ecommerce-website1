window.addEventListener("load",()=>{
    const input = document.getElementById("upload");
    const fileWrapper = document.getElementById("filewrapper");

    input.addEventListener("change",(e)=>{
        let fileName = e.target.files[0].name;
        let fileType = e.target.value.split(".").pop();
        fileShow(fileName,fileType);
    })

    const fileShow = (fileName,fileType)=>{
        const showFileBoxElement = document.createElement("div");
        showFileBoxElement.classList.add("showfilebox");
        const leftElement = document.createElement("div");
        leftElement.classList.add("left");

        const fileTypeElement = document.createElement("span");
        fileTypeElement.classList.add("filetype");
        fileTypeElement.innerHTML = fileType;
        leftElement.append(fileTypeElement);

        const fileTitleElement = document.createElement("h3");
        fileTitleElement.innerHTML = fileName;
        leftElement.append(fileTitleElement);
        showFileBoxElement.append(leftElement);

        const rightElement = document.createElement("div");
        rightElement.classList.add("right");
        showFileBoxElement.append(rightElement);

        const crossElement = document.createElement("span");
        crossElement.innerHTML= "&#215;";
        rightElement.append(crossElement);
        fileWrapper.append(showFileBoxElement);

        crossElement.addEventListener("click",()=>{
            fileWrapper.removeChild(showFileBoxElement);
        })
    }
})    