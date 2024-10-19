let index_Tables = 0 ;
let TabClientsId = [] ;
let TabTimesTamp = [] ;
let TabBwRequested = [] ;

class Client {
    constructor(clientId, cir, maxBandwidth) {
        this.clientId = clientId;  // ID du client
        this.cir = cir;  // Débit minimum garanti
        this.maxBandwidth = maxBandwidth;  // Débit maximum disponible pour ce client
        this.currentBandwidth = cir;  // Débit courant alloué à ce client
        this.usageHistory = [];  // Historique de l'utilisation de la bande passante
    }

    requestBandwidth() {
        // Génère une demande aléatoire de bande passante entre le CIR et le maximum
        return Math.random() * (this.maxBandwidth - this.cir) + this.cir;
    }

    // Fonction pour simuler un téléchargement avec facteur d'accélération
    simulateDownload(fileSize, allocatedBandwidth, speedUpFactor = 1000) {
        return new Promise((resolve) => {
            if (allocatedBandwidth === 0) {
                console.log(`Client ${this.clientId}: Aucun débit alloué, téléchargement impossible.`);
                resolve();
                return;
            }

            // La taille du fichier est en octets, la bande passante est en Mbps (Méga bits par seconde)
            const downloadTime = (fileSize * 8) / (allocatedBandwidth * 1e6);  // Convertir la taille en bits et la bande passante en bps
            const simulatedDownloadTime = downloadTime / speedUpFactor;  // Accélérer le téléchargement

            console.log(`Client ${this.clientId}: Début du téléchargement d'un fichier de ${(fileSize / 1e6).toFixed(2)} MB avec ${allocatedBandwidth.toFixed(2)} Mbps.`);

            setTimeout(() => {
                console.log(`Client ${this.clientId}: Téléchargement terminé en ${simulatedDownloadTime.toFixed(2)} secondes (simulé).`);
                resolve();
            }, simulatedDownloadTime * 1000);  // Attendre le temps de téléchargement simulé
        });
    }

    updateBandwidth(consumed) {
        // Stocker l'utilisation dans l'historique
        this.usageHistory.push(consumed);
        if (consumed > this.currentBandwidth) {
            // Ajuster le débit pour la prochaine demande
            this.currentBandwidth = Math.min(this.currentBandwidth + 1, this.maxBandwidth);
        } else {
            // Garder le débit entre CIR et la bande passante max
            this.currentBandwidth = Math.max(this.cir, this.currentBandwidth - 1);
        }
    }
}

class Router {
    constructor(server) {
        this.clients = [];  // Liste des clients connectés
        this.server = server;  // Référence vers le serveur
    }

    connectClient(client) {
        this.clients.push(client);
    }

    routeTraffic() {
        // Simuler l'acheminement du trafic vers chaque client
        this.clients.forEach(client => {
            let wants = client.requestBandwidth();
            let allocatedBandwidth = this.server.allocateBandwidth(client, wants);
            client.updateBandwidth(allocatedBandwidth);
            console.log(`Client ${client.clientId} a demandé ${wants.toFixed(2)} Mbps, alloué ${allocatedBandwidth.toFixed(2)} Mbps, débit actuel ${client.currentBandwidth.toFixed(2)} Mbps.`);
        });
    }
}

class Server {
    constructor(totalBandwidth) {
        this.totalBandwidth = totalBandwidth;  // Bande passante totale disponible pour tous les clients
        this.usedBandwidth = 0;  // Bande passante actuellement utilisée
        this.fileSize = 80e6;  // Exemple de taille de fichier 80MB
    }

    allocateBandwidth(client, wants) {
        // Calculer la bande passante disponible
        let availableBandwidth = this.totalBandwidth - this.usedBandwidth;
        let allocated = 0;

        // Allouer la bande passante en fonction de la demande et de la disponibilité
        if (wants <= availableBandwidth && wants <= client.maxBandwidth) {
            allocated = wants;
        } else {
            allocated = Math.min(availableBandwidth, client.maxBandwidth);
        }

        this.usedBandwidth += allocated;
        return allocated;
    }

    async simulateNetworkTraffic(clients, speedUpFactor) {
        for (let client of clients) {
            let wants = client.requestBandwidth();
            let allocated = this.allocateBandwidth(client, wants);
            console.log(`Client ${client.clientId} a demandé ${wants.toFixed(2)} Mbps, alloué ${allocated.toFixed(2)} Mbps.`);
            // Simuler le téléchargement d'un fichier en fonction de la bande passante allouée
            await client.simulateDownload(this.fileSize, allocated, speedUpFactor);

            let dateActuelle = new Date();
            let jour = dateActuelle.getDate();
            let mois = dateActuelle.getMonth() + 1;
            let annee = dateActuelle.getFullYear();
            let heures = dateActuelle.getHours();
            let minutes = dateActuelle.getMinutes();
            let secondes = dateActuelle.getSeconds();

            let timestamp = annee + "-" + mois + "-" + jour + " " + heures + ":" + minutes + ":" + secondes ;  


            TabClientsId[index_Tables] = client.clientId ;
            TabBwRequested[index_Tables] = wants ;
            TabTimesTamp[index_Tables] = timestamp;
            index_Tables++ ;
        }

        // Réinitialiser la bande passante utilisée pour la prochaine simulation
        this.usedBandwidth = 0;
    }
}

// Simulation du réseau avec des clients, un routeur et un serveur
(async function simulate() {
    // Créer un serveur avec une bande passante totale de 30 Mbps
    const server = new Server(30);

    // Créer un routeur connecté au serveur
    const router = new Router(server);

    // Créer des clients avec une bande passante max et un CIR
    const client1 = new Client(1, 0.5, 0.5);  // Client 1 with 0.5 Mbps constant bandwidth
    const client2 = new Client(2, 1, 10);     // Other clients with 1 Mbps CIR and up to 10 Mbps
    const client3 = new Client(3, 1, 10);

    // Connecter les clients au routeur
    router.connectClient(client1);
    router.connectClient(client2);
    router.connectClient(client3);

    // Simuler plusieurs tours de trafic réseau avec un facteur d'accélération
    const speedUpFactor = 1000;  // Accélérer la simulation par un facteur de 1000
    for (let i = 0; i < 10; i++) {
        console.log("\nRoutage du trafic...");
        await server.simulateNetworkTraffic(router.clients, speedUpFactor);
    }
    console.log(TabTimesTamp) ;
    console.log(TabClientsId) ;
    console.log(TabBwRequested) ;
})();