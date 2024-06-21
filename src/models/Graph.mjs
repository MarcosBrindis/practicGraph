import { LinkedList } from "./LinkedList.mjs";

export default class Graph {
    #matrizAdyacencia = [];
    #map = new Map();
   
    addV(value) {
        this.#matrizAdyacencia.push(new LinkedList());
        //this.#matrizAdyacencia.push([])
        this.#map.set(value, this.#matrizAdyacencia.length - 1);
    }

    addConexion(start, end, weight = 1) {
        if (this.#map.has(start) && this.#map.has(end)) {
            this.#matrizAdyacencia[this.#map.get(start)].push({ name: end, weight: weight });
           // this.#matrizAdyacencia2[this.#map.get(start)][this.#map.get(end)] = weight
            return true;
        }
        return false;
    } 

    dfs(callback) {
        const visited = new Set();
        const dfsVisit = (vertex) => {
            if (!visited.has(vertex)) {
                visited.add(vertex);
                callback(vertex);
                const neighbors = this.#matrizAdyacencia[this.#map.get(vertex)];
                let neighborList = neighbors.recorrido();
                neighborList.forEach(neighbor => dfsVisit(neighbor.name));
            }
        };
        
        for (const key of this.#map.keys()) {
            if (!visited.has(key)) {
                dfsVisit(key);
            }
        }
    }

    getVertexIndex(value) {
        return this.#map.get(value);
    }

    getVertices() {
        return Array.from(this.#map.keys());
    }

    dijkstra(startVertex) {
        const inf = 100000000; 
        const W = this.#matrizAdyacencia;
        const size = W.length;
        const L = new Set();//vértices ya visitados.
        const LPrime = new Set(this.getVertices()); //vértices no visitados.
        const D = Array(size).fill(inf); 
        const previous = {}; // almacena el vértice previo en el camino mínimo para cada vértice.
        const startIndex = this.getVertexIndex(startVertex);
        D[startIndex] = 0; 

        while (L.size !== size) {
            let minDist = inf;
            let minVertex = null;

            // Busca el vértice en LPrime con la distancia mínima
            for (let vertex of LPrime) {
                const vertexIndex = this.getVertexIndex(vertex);
                if (D[vertexIndex] < minDist) {
                    minDist = D[vertexIndex];
                    minVertex = vertex;
                }
            }

            if (minVertex === null) {
                break;
            }

            L.add(minVertex); // Agrega el vértice mínimo a L
            LPrime.delete(minVertex); // Elimina el vértice mínimo de LPrime

            const u = this.getVertexIndex(minVertex);

            const neighbors = W[u].recorrido();
            neighbors.forEach(neighbor => {
                const v = this.getVertexIndex(neighbor.name);
                const weight = neighbor.weight;
                if (D[u] + weight < D[v]) {
                    D[v] = D[u] + weight;
                    previous[neighbor.name] = minVertex; 
                }
            });
        }

        return { distances: D, previous: previous };
    }
/*
    getPrevious(startVertex) {
        const { previous } = this.dijkstra(startVertex);
        return previous;
    }*/

}
