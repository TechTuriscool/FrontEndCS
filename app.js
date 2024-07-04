document.addEventListener("DOMContentLoaded", () => {
    
    let usersPHP = [];
    let usersFirmafy = [];

    // Obtener usuarios desde localhost
    async function getUsers() {
        let response = await fetch("http://localhost:4000/");
        let data = await response.json();
        usersPHP = data;
        console.log(usersPHP);
        return data;
    }

    async function getCSV() {
        return new Promise((resolve, reject) => {
            const inputFile = document.getElementById('fileInput').files[0];
            if (inputFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const text = e.target.result;
                    const rows = text.split('\n').map(row => row.split(';').map(cell => cell.trim()));
                    
                    // Mostrar el contenido del CSV en la consola
                    resolve(rows);
                };
                reader.onerror = function() {
                    reject('Error al leer el archivo');
                };
                reader.readAsText(inputFile);
            } else {
                alert('Por favor, seleccione un archivo CSV.');
                reject('No se seleccionó ningún archivo');
            }
        });
    }

    // Obtener emails recorriendo todas las filas excepto la primera y obteniendo la 8va posición de las separadas por comas
    function obtenerEmails(rows) {
        let emails = [];
        for (let i = 1; i < rows.length; i++) {
            let row = rows[i]; // Aquí no es necesario dividir nuevamente, ya está dividido
            if (row.length > 7 && row[7]) { // Asegurarse de que hay al menos 8 columnas y que la 8va no esté vacía
                emails.push(row[7]);
            }
        }
        console.log(emails);
        return emails;
    }

    async function printRows(event) {
        event.preventDefault();
        try {
            const rows = await getCSV();
            usersFirmafy = obtenerEmails(rows); // Guardar los emails obtenidos
            compararUsuarios();
        } catch (error) {
            console.error(error);
        }
    }

    // Comparar usuarios de firmafy que están en php
    function compararUsuarios() {
        let usuariosComunes = [];
        for (let i = 0; i < usersPHP.length; i++) {
            for (let j = 0; j < usersFirmafy.length; j++) {
                if (usersPHP[i].correo == usersFirmafy[j]) {
                    usuariosComunes.push(usersPHP[i]);
                }
            }
        }
        console.log(usuariosComunes);

        //crear una tabla con los usuarios comunes con los campos correo, link y marca

        let table = document.createElement('table');
        table.classList.add('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        let tr = document.createElement('tr');
        let thCorreo = document.createElement('th');
        let thLink = document.createElement('th');
        let thMarca = document.createElement('th');
        thCorreo.textContent = 'Correo';
        thLink.textContent = 'Link';
        thMarca.textContent = 'Marca';
        tr.appendChild(thCorreo);
        tr.appendChild(thLink);
        tr.appendChild(thMarca);
        thead.appendChild(tr);
        table.appendChild(thead);
        for (let i = 0; i < usuariosComunes.length; i++) {
            let tr = document.createElement('tr');
            let tdCorreo = document.createElement('td');
            let tdLink = document.createElement('td');
            let tdMarca = document.createElement('td');
            tdCorreo.textContent = usuariosComunes[i].correo;
            tdLink.textContent = usuariosComunes[i].link;
            tdMarca.textContent = usuariosComunes[i].Marca;
            tr.appendChild(tdCorreo);
            tr.appendChild(tdLink);
            tr.appendChild(tdMarca);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        document.getElementById('tableContainer').innerHTML = '';
        document.getElementById('tableContainer').appendChild(table);

    }

    //crear un txt con la informacion de la tabla

    function downloadTxt() {
        let table = document.querySelector('table');
        let rows = table.querySelectorAll('tr');
        let text = '';
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].querySelectorAll('td');
            for (let j = 0; j < cells.length; j++) {
                text += cells[j].textContent + '\t';
            }
            text += '\n';
        }
        let blob = new Blob([text], { type: 'text/plain' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'usuarios_comunes.txt';
        a.click();
    }

    //crar un boton para descargar el txt

    document.getElementById('downloadBtnTxT').addEventListener('click', downloadTxt);

    //crear un csv con la informacion de la tabla

    function downloadCsv() {
        let table = document.querySelector('table');
        let rows = table.querySelectorAll('tr');
        let text = '';
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].querySelectorAll('td');
            for (let j = 0; j < cells.length; j++) {
                text += cells[j].textContent + ';';
            }
            text += '\n';
        }
        let blob = new Blob([text], { type: 'text/csv' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'usuarios_comunes.csv';
        a.click();
    }

    //crar un boton para descargar el csv

    document.getElementById('downloadBtnCsv').addEventListener('click', downloadCsv);



    
    
    document.getElementById('csvForm').addEventListener('submit', printRows);
    getUsers();
});
