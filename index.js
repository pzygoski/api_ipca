import express from 'express';
import { buscarIPCA, buscarIpcaPorAno, buscarIpcaPorId, calculoIPCA, validaParametros } from './servicos/servico.js';

const app = express();

app.get('/historicoIPCA', (req,res)  => {
    const ano = req.query.ano;
    const resultado = ano ? buscarIpcaPorAno(ano) : buscarIPCA();
    if (resultado.length > 0) {
        res.json(resultado);
    }
    else{
        res.status(404).send({"erro":"Nenhum histórico encontrado para o ano especificado"})
    }
})

app.get('/historicoIPCA/calculo', (req, res) => {
    const { valor, mesInicial, anoInicial, mesFinal, anoFinal } = req.query;

    const valorInicial = parseFloat(valor);
    const mesInicialInt = parseInt(mesInicial);
    const anoInicialInt = parseInt(anoInicial);
    const mesFinalInt = parseInt(mesFinal);
    const anoFinalInt = parseInt(anoFinal);

    if (anoInicialInt > anoFinalInt) {
        return res.status(400).send({"erro": "Parâmetros inválidos"});
    }

    if (validaParametros(valorInicial,  mesInicialInt, anoInicialInt, mesFinalInt, anoFinalInt) === false) {
        return res.status(400).send({"erro": "P inválidos"});
    } 
    else {
        const resultado = calculoIPCA(valorInicial, mesInicialInt, anoInicialInt, mesFinalInt, anoFinalInt);

        if (!isNaN(resultado)) {
            res.json({ "resultado": resultado.toFixed(2) });
        }
    }
});

app.get('/historicoIPCA/:idIpca', (req,res) => {
    const ipca = buscarIpcaPorId(req.params.idIpca);

    if(ipca) {
        res.json(ipca);
    } else {
        res.status(404).send({"erro":"Elemento não encontrado"})
    }
})

app.listen (8080, () => {
    console.log('Servidor iniciado na porta 8080')
})