function loadEndpoints(){
    const noEndpoints = [{name: "No endpoints"}];
    fetch('/endpoints')
    .then(r=>{
        if(r.status != 200)
            return [{name:'NO RESPONSE FROM SERVER'}]
        return r.json();
    })
    .catch(err=>{
        return [{name: "Fetch error"}];
    })
    .then(endpoints=>{
        fillContainer(endpoints.length ? endpoints : noEndpoints);
    })
}
function fillContainer(endpoints){
    console.log(endpoints)
    endpoints.forEach(el=>addEndpointToContainer(el));
}
function addEndpointToContainer({name = '',description = ''}){
    const container = document.querySelector('#endpoints');
    let el = document.createElement('li');
    el.innerHTML = `<h5>${name}</h5><p>${description}</p>`;
    container.appendChild(el);
    return;
}

console.log('attached');
loadEndpoints();