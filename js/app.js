const result = document.querySelector('#result');
const form = document.querySelector('#form');
const paginationDiv = document.querySelector('#pagination');

const registerPagination = 30;
let totalPages;
let iterator;
let currentPage = 1;

window.onload = () => {
    let termSearch = 'paisajes'
    searchImages(termSearch);
    form.addEventListener('submit',validateForm)
}

function validateForm(e){
    e.preventDefault();
    const termSearch = document.querySelector('#term').value;
    if(termSearch === ''){
        showAlert('Agrega un Término de Busqueda')
    }
    searchImages();
}

function showAlert(message){
    const existAlert = document.querySelector('.bg-red-100');
    if(!existAlert){
        const alert = document.createElement('p');
        alert.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center');
        alert.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span cllass="block sm:inline">${message}</span>
        `;
        form.appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
} 

async function searchImages(){
    const term = document.querySelector('#term').value;
    const key ='30853507-432b911b162dd7329aae1bd13';
    const url = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=${registerPagination}&page=${currentPage}`;
 
        try {
            const resp = await fetch(url);
            const result = await resp.json();
            totalPages = estimatePages(result.totalHits)
            showImages(result.hits)
            
        } catch (error) {
            console.log(error)
        }
    }
    
    //CALCULATE PAGINATION
    function estimatePages(total){
        return parseInt(Math.ceil(total/registerPagination));
    }
    
    //GENERATE PAGES
    function *createPaginator(total){
        for (let i =1;  i<= total; i++){
            yield i;
        
    }
}

//SHOW IMAGES
function showImages(images){
    while(result.firstChild){
        result.removeChild(result.firstChild);
    }

    images.forEach(image => {
        const {previewURL, likes, views, largeImageURL} = image;
        result.innerHTML += `
                <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3">
                    <div class="bg-white ">
                        <div class="card ">
                                <img class="img " src="${previewURL}">
                        </div>
                        <div class="p-4">
                        <p class="font-bold flex">${likes}<span class="font-light"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg></span></p>
                        <p class="font-bold flex">${views}<span class="font-light"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg></span></p>
                        <a class=" mt-5 p-1 block w-full bg-indigo-800 hover:bg-blue-500 text-white font-bold text-center rounded " href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                            Ver Imagen
                        </a>
                        </div>
                    </div>
                </div>
        `
    });
    //CLEAR PAGINATION
    while(paginationDiv.firstChild){
        paginationDiv.removeChild(paginationDiv.firstChild)
    }

    //GENERATE PAGINATOR
    printPaginator();
}

//PRINT PAGINATION
function printPaginator(){
    iterator = createPaginator(totalPages);
    while(true){
        const {value, done} = iterator.next();
        if(done) return;
        //CREATE BTN
        const botton = document.createElement('a');
        botton.href = '#';
        botton.dataset.page = value;
        botton.textContent = value;
        botton.classList.add('next','text-black',  'px-4', 'py-1','m-2','font-bold','mb-1','rounded-full');
      
        botton.onclick = () =>{
            currentPage = value;
          
            searchImages();
        }
        paginationDiv.appendChild(botton);
    }
}