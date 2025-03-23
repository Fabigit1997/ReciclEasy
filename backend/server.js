const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect("mongodb://localhost:27017/reciclagem", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.log("Erro ao conectar ao MongoDB", err));
  

  // Função para calcular a distância entre dois pontos
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em km
    return distance;
  }
  

// Criar Schema do Catador
const CatadorSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  });
  

const Catador = mongoose.model("Catador", CatadorSchema);

// Rota para cadastrar um catador
app.post("/catadores", async (req, res) => {
    try {
      const { nome, telefone, latitude, longitude } = req.body;
      const novoCatador = new Catador({ nome, telefone, latitude, longitude });
      await novoCatador.save();
      res.status(201).json(novoCatador);
    } catch (error) {
      res.status(500).json({ message: "Erro ao cadastrar catador", error });
    }
  });
  
// Rota para listar catadores próximos
app.get("/catadores/proximos", async (req, res) => {
    const { latitude, longitude } = req.query; // Pegando latitude e longitude do usuário
  
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude e longitude são obrigatórios" });
    }
  
    const catadores = await Catador.find(); // Obtém todos os catadores
  
    // Calcular a distância de cada catador
    const catadoresProximos = catadores.map((catador) => {
      const distance = haversine(
        parseFloat(latitude), 
        parseFloat(longitude), 
        catador.latitude, 
        catador.longitude
      );
      return { ...catador.toObject(), distance }; // Adiciona a distância ao catador
    });
  
    // Ordenar os catadores pela distância
    catadoresProximos.sort((a, b) => a.distance - b.distance);
  
    // Retornar os catadores mais próximos
    res.json(catadoresProximos);
  });
  
// Rota para listar catadores
app.get("/catadores", async (req, res) => {
  const catadores = await Catador.find();
  res.json(catadores);
});

// Rodar o servidor
app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
