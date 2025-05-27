// src/services/PontosService.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const buscarPontosDeColeta = async () => {
  try {
    const pontosColetaRef = collection(db, 'pontos_coleta');
    const catadoresRef = collection(db, 'Catador');

    const [pontosSnapshot, catadoresSnapshot] = await Promise.all([
      getDocs(pontosColetaRef),
      getDocs(catadoresRef),
    ]);

    const pontosColeta = pontosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      tipo: 'Ponto de Coleta'
    }));

    const catadores = catadoresSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      tipo: 'Catador'
    }));

    return [...pontosColeta, ...catadores];
  } catch (error) {
    console.error("Erro ao buscar pontos e catadores:", error);
    return [];
  }
};
