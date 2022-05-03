$(function(){

    var operacao = "A";
    
    var indice_selecionado = -1; // retoma na posição anterior

    var tbClientes = localStorage.getItem("tbClientes"); // recupera os dados armazenados

    tbClientes = JSON.parse(tbClientes);// analisa uma string (sequencia ou cadeias de caracteres) JSON construindo o valor ou um objeto JS descrito pela string

    if(tbClientes == null)
       tbClientes == [];

// função para adioionar registros
       function Adicionar(){

  //variavel para verificar se numero de chamado já existe         
        var cli = GetCliente( "chamado", $("#chamado").val());
        // caso exista é informado ao cliente
        if (cli != null){
            alert("código já castrado");
            return
        }

       }
       //caso contrário insere
       var cliente = JSON.stringify({
           Chamado       : $("#chamado").val(),
           Datachamado   : $("#datChamado").val(),
           HoraChamado   : $("#horChamado").val(),
           Categoria     : $("#categoria").val(),
           DesProblema   : $("#desProblema").val(),
           Usuario       : $("#usuAbertura").val(),
           Prioridade    : $("prioridade").val(),
           Status        : $("status").val()
       }),
       //adiciona as informações da variavel Cliente
         tbClientes.push(Cliente);

 // aqui é inserido as informações TBClientes - Stringify converte valores em javascript para uma String  JSON
         localStorage.setItem("tbClientes", JSON.stringify(tbClientes));

         alert ("Registro adicionado.");

         return true;
       }

       //função para editar clientes
 function Editar(){
    tbClientes[indice_selecionado] = JSON.stringify({
        Chamado       : $("#chamado").val(),
        Datachamado   : $("#datChamado").val(),
        HoraChamado   : $("#horChamado").val(),
        Categoria     : $("#categoria").val(),
        DesProblema   : $("#desProblema").val(),
        Usuario       : $("#usuAbertura").val(),
        Prioridade    : $("prioridade").val(),
        Status        : $("status").val(),
       });

       localStorage.setItem("tbClientes", JSON.stringify(tbClientes));
       alert ("informações editadas.")
       operacao = "A"
       return true;
    }

    // função para listar clientes
    function Listar(){
        $("#tbListar").html("");
        $("tbListar").html (
            "<thead>"+
            "   <tr>"+
            "<th></th>"+
            " <th>Chamado</th>"+
            " <th>DataChamado</th>"+
            " <th>HoraChamado</th>"+
            " <th>Categoria</th>"+
            " <th>DescricaoProblema</th>"+
            " <th>Usuarioa</th>"+
            " <th>Prioridade/th>"+
            " <th>Status</th>"+
            "</tr>"+
            "</thead>"+
            "</tbody>"
        );

        //Malha de repetição para inserir todos os registros
        for(var i in tbclientes){
           var cli = JSON.parse(tbClientes[i]);
           $("#tbListar tbody").append("<tr>"+
                                       " <td><img src="img/edi

           
           
           )



        }





    }
           

           
        


}