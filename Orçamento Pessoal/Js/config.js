    class Despesa{
        constructor(ano, mes, dia, tipo, descricao, valor){
            this.ano = ano;
            this.mes = mes;
            this.dia = dia;
            this.tipo = tipo;
            this.descricao = descricao;
            this.valor = valor;
        }

        validarDados(){
            for(let i in this){
                if(this[i] == undefined || this[i] == '' || this[i] == null){
                    return false
                }
            }
            return true
        }
    }

    class Bd{
        constructor(){
            let id = localStorage.getItem('id');
            if(id == null){
                localStorage.setItem('id', 0);
            }
        }

        getProximoId(){
            let proximoId = localStorage.getItem('id')
            return parseInt(proximoId) + 1
        }

        gravar(d){
            let id  = this.getProximoId()
            localStorage.setItem(id, JSON.stringify(d))
            localStorage.setItem('id', id)
        }
        
        recuperarRegistros(){
            //array de despesas
            let despesasRecuperadas = Array()
            let id  = localStorage.getItem('id')
            //Recupera todas as depesas cadastradas em local storage
            for (let i = 1; i <= id; i++){
                //Recupera as despesas
                let despesaRecuperada = JSON.parse(localStorage.getItem(i))
                //Eliminação de indice null
                if(despesaRecuperada === null){
                    continue
                }
                //colocando as despessas em array
                despesaRecuperada.id = i;
                despesasRecuperadas.push(despesaRecuperada)
            }
            return despesasRecuperadas
        }
        pesquisar(despesa){
            let despessasFiltradas = Array()
            despessasFiltradas = this.recuperarRegistros()
            // Filtro por ano
            if (despesa.ano !=''){
                despessasFiltradas = despessasFiltradas.filter(d => d.ano == despesa.ano)
            }
            // Filtro por mes
            if (despesa.mes !=''){
                despessasFiltradas = despessasFiltradas.filter(d => d.mes == despesa.mes)
            }
            // Filtro por dia
            if (despesa.dia !=''){
                despessasFiltradas = despessasFiltradas.filter(d => d.dia == despesa.mes)
            }
            // Filtro por tipo
            if (despesa.tipo !=''){
                despessasFiltradas = despessasFiltradas.filter(d => d.tipo == despesa.tipo)
            }
            // Filtro por descrição
            if (despesa.descricao !=''){
                despessasFiltradas = despessasFiltradas.filter(d => d.descricao == despesa.descricao)
            }
            // Filtro por valor
            if (despesa.valor !=''){
                despessasFiltradas = despessasFiltradas.filter(d.valor == despesa.valor)
            }
            return despessasFiltradas;
        }

        remover(id){
            localStorage.removeItem(id);
        }
    }

    let bd = new Bd()

    function salvarDespesas(){
    // Recuperando Valores
        let ano = document.getElementById('ano').value;
        let mes = document.getElementById('mes').value;
        let dia = document.getElementById('dia').value;
        let tipo = document.getElementById('tipo').value;
        let descricao = document.getElementById('descricao').value;
        let valor = document.getElementById('valor').value;

        let despesas = new Despesa(
            ano,
            mes,
            dia,
            tipo,
            descricao,
            valor
        )
            
    //validadção de Dados
        if(despesas.validarDados()){
            bd.gravar(despesas)
            alert('Salvo com Sucesso')
        //limpando campos
            this.ano.value = '';
            this.mes.value = '';
            this.dia.value = '';
            this.tipo.value = '';
            this.descricao.value = '';
            this.valor.value = '';
        }else{
            alert('Preencha tosos os campos');
        }        
    }

    function carregarLista( despesas = Array() , filter = false){

        if(despesas.length == 0 && filter == false ){
            despesas = bd.recuperarRegistros();
        }

        //colocando dados na tabela
        let lista_Despesas = document.getElementById('listaDespesas');
        lista_Despesas.innerHTML = '';

        //percorrer array despesas
        despesas.forEach(function(d){
            //criando a linha (tr);
            let linha = listaDespesas.insertRow(d);
            //criando colunas (td);
            linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
            linha.insertCell(1).innerHTML = d.tipo;
            linha.insertCell(2).innerHTML = d.descricao;
            linha.insertCell(3).innerHTML = d.valor;

            // botão de eclusão
            let btnEcluir = document.createElement("button");
            btnEcluir.className = 'btn btn-danger';
            btnEcluir.innerHTML = '<i class="fas fa-times"></i>';
            btnEcluir.id = `id_despesa_${d.id}`;
            btnEcluir.onclick = function(){
                let id = this.id.replace('id_despesa_', '');
                bd.remover(id);
                alert("Excluido Com Sucesso");
                window.location.reload(); 
            }
            linha.insertCell(4).append(btnEcluir);
        })
    }

    function pesquisarDespesas() {
        let ano = document.getElementById('ano').value;
        let mes = document.getElementById('mes').value;
        let dia = document.getElementById('dia').value;
        let tipo = document.getElementById('tipo').value;
        let descricao = document.getElementById('descricao').value;
        let valor = document.getElementById('valor').value;
        let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
        let despesas = bd.pesquisar(despesa);
        this.carregarLista(despesas, true);       
}