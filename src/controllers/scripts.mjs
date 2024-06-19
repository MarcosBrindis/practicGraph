import Port from "../models/Port.mjs";
import Graph from "../models/Graph.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const newportButton = document.getElementById('newport');
    const formFields = document.getElementById('formFields');
    const acceptButton = document.getElementById('newnode');
    const comboboxContainer = document.getElementById('comboboxContainer');
    const codeportInput = document.getElementById('codeport');
    const nameInput = document.getElementById('name');
    const countryInput = document.getElementById('country');
    const graphActions = document.getElementById('graphActions');
    const dfsButton = document.getElementById('dfsButton');
    const dijkstraButton = document.getElementById('dijkstraButton');
    const dfsOutput = document.getElementById('dfsOutput');
    const dfsResults = document.getElementById('dfsResults');
    const dijkstraFields = document.getElementById('dijkstraFields');
    const startPointInput = document.getElementById('startPoint');
    const endPointInput = document.getElementById('endPoint');
    const dijkstraOutput = document.getElementById('dijkstraOutput');
    const dijkstraResults = document.getElementById('dijkstraResults');

    let ports = [];
    let combobox1, combobox2, distanceInput, acceptComboboxButton;
    const graph = new Graph();

    newportButton.addEventListener('click', () => {
        formFields.style.display = 'block';
        newportButton.style.display = 'none';
        comboboxContainer.style.display = 'none';
        graphActions.style.display = 'none';
        dijkstraFields.style.display = 'none';
        dfsResults.style.display = 'none';
        dijkstraResults.style.display = 'none';
    });

    acceptButton.addEventListener('click', () => {
        const codeport = codeportInput.value.trim();
        const name = nameInput.value.trim();
        const country = countryInput.value.trim();

        if (codeport && name && country) {
            const newPort = new Port(codeport, name, country);
            ports.push(newPort);
            graph.addV(newPort.codeport);
            if (!combobox1 && !combobox2 && !distanceInput) {
                createComboboxes();
            }
            updateComboboxes();
            clearForm();
            formFields.style.display = 'none';
            newportButton.style.display = 'block';
            comboboxContainer.style.display = 'block';
            graphActions.style.display = 'block';
            dijkstraFields.style.display = 'block';
        }
    });

    function createComboboxes() {
        combobox1 = document.createElement('select');
        combobox2 = document.createElement('select');
        distanceInput = document.createElement('input');
        acceptComboboxButton = document.createElement('button');

        distanceInput.type = 'text';
        distanceInput.placeholder = 'Nautical miles';
        distanceInput.classList.add('distance-input');

        acceptComboboxButton.textContent = 'Accept';
        acceptComboboxButton.classList.add('btn', 'btn-accept');
        acceptComboboxButton.addEventListener('click', () => {
            const distance = distanceInput.value.trim();

            if (combobox1.value && combobox2.value && distance) {
                alert(`Selected ports: ${combobox1.value} and ${combobox2.value}, Distance: ${distance} Nautical miles`);
                graph.addConexion(combobox1.value, combobox2.value, parseFloat(distance));
            } else {
                alert('Please select ports and enter a distance.');
            }
        });

        comboboxContainer.appendChild(combobox1);
        comboboxContainer.appendChild(combobox2);
        comboboxContainer.appendChild(distanceInput);
        comboboxContainer.appendChild(acceptComboboxButton);
    }

    function updateComboboxes() {
        const selectedValue1 = combobox1 ? combobox1.value : '';
        const selectedValue2 = combobox2 ? combobox2.value : '';

        combobox1.innerHTML = '';
        combobox2.innerHTML = '';

        ports.forEach(port => {
            const option1 = document.createElement('option');
            option1.value = port.codeport;
            option1.textContent = port.codeport;
            combobox1.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = port.codeport;
            option2.textContent = port.codeport;
            combobox2.appendChild(option2);
        });

        if (selectedValue1) {
            combobox1.value = selectedValue1;
        }
        if (selectedValue2) {
            combobox2.value = selectedValue2;
        }
    }

    function clearForm() {
        codeportInput.value = '';
        nameInput.value = '';
        countryInput.value = '';
    }

    dfsButton.addEventListener('click', () => {
        dfsResults.style.display = 'block';
        dfsOutput.innerHTML = '';
        graph.dfs((node) => {
            const port = ports.find(p => p.codeport === node);
            if (port) {
                const resultItem = document.createElement('li');
                resultItem.textContent = `Visited: Code Port: ${port.codeport}, Name: ${port.name}, Country: ${port.country}`;
                dfsOutput.appendChild(resultItem);
            }
        });
    });

    dijkstraButton.addEventListener('click', () => {
        const startPoint = startPointInput.value.trim();
        const endPoint = endPointInput.value.trim();
        if (startPoint && endPoint) {
            const { distances, previous } = graph.dijkstra(startPoint);
            dijkstraResults.style.display = 'block';
            dijkstraOutput.innerHTML = '';
            let path = [];
            for (let at = endPoint; at; at = previous[at]) {
                path.push(at);
            }
            path.reverse();
            path.forEach(node => {
                const port = ports.find(p => p.codeport === node);
                if (port) {
                    const resultItem = document.createElement('li');
                    resultItem.textContent = `Path: Code Port: ${port.codeport}, Name: ${port.name}, Country: ${port.country}`;
                    dijkstraOutput.appendChild(resultItem);
                }
            });
            const distanceItem = document.createElement('li');
            distanceItem.textContent = `Total distance: ${distances[endPoint]} nautical miles`;
            dijkstraOutput.appendChild(distanceItem);
        } else {
            alert('Please enter both start and end points.');
        }
    });
});
