import apiClient from "@/services/apiClient"; // Certifique-se de que o caminho está correto

const validarLogin = (cnpjParam, senhaParam) => {
  const loginDto = {
    cnpj: cnpjParam,
    senha: senhaParam,
  };
  return new Promise((resolve, reject) => {
    apiClient
      .post("Usuario/Login", loginDto)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
};

export default {
  validarLogin,
};

// GET /api/Faturas/ObterCreditosClienteFornecedor?codigoCliente=123&ehReceber=true
// apiClient.get('/api/Faturas/ObterCreditosClienteFornecedor', {
//   params: { codigoCliente: 123, ehReceber: true }
// });

// GET /api/Clientes/123
// const clienteId = 123;
// apiClient.get(`/api/Clientes/${clienteId}`);

// POST /api/Usuarios/Login
// const loginDto = {
//   email: 'usuario@email.com',
//   senha: '123456'
// };

// apiClient.post('/api/Usuarios/Login', loginDto);

// PUT /api/Clientes/123
// const clienteId = 123;
// const clienteDto = {
//   nome: 'Novo Nome',
//   telefone: '99999-0000'
// };

// apiClient.put(`/api/Clientes/${clienteId}`, clienteDto);

// DELETE /api/Animais/456
// const animalId = 456;
// apiClient.delete(`/api/Animais/${animalId}`);

// DELETE /api/Usuarios?email=teste@email.com
// apiClient.delete('/api/Usuarios', {
//   params: { email: 'teste@email.com' }
// });

// const formData = new FormData();
// formData.append('imagem', arquivo);
// formData.append('usuarioId', 123);

// apiClient.post('/api/Usuarios/EnviarFoto', formData, {
//   headers: {
//     'Content-Type': 'multipart/form-data'
//   }
// });
