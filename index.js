$(function(){

    var operacao = "A"; //"A"=Adição; "E"=Edição
    
    var indice_selecionado = -1; // retoma na posição anterior

    var tbClientes = localStorage.getItem("tbClientes"); // recupera os dados armazenados

    tbClientes = JSON.parse(tbClientes);// analisa uma string (sequencia ou cadeias de caracteres) JSON construindo o valor ou um objeto JS descrito pela string

    if(tbClientes == null)
       tbClientes == [];

      // função para adioionar registros
       function Adicionar(){
      //variavel para verificar se numero de chamado já existe         
        var cli = GetCliente("chamado", $("#chamado").val());
        // caso exista é informado ao cliente
        if (cli != null){
            alert("código já castrado");
            return;
        }

       //caso contrário insere
       var cliente = JSON.stringify({
           Chamado       : $("#chamado").val(),
           Datachamado   : $("#datChamado").val(),
           HoraChamado   : $("#horChamado").val(),
           Categoria     : $("#categoria").val(),
           DesProblema   : $("#desProblema").val(),
           Usuario       : $("#usuAbertura").val(),
           Prioridade    : $("#prioridade").val(),
           Status        : $("#status").val()
         });

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
        Prioridade    : $("#prioridade").val(),
        Status        : $("#status").val(),
       });

       localStorage.setItem("tbClientes", JSON.stringify(tbClientes));
       alert ("informações editadas.")
       operacao = "A"
       return true;
    }

    // função para listar clientes
    function Listar(){
        $("#tbListar").html("");
        $("#tbListar").html (
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
            "<tbody>"+
            "</tbody>"

            
        );

        //Malha de repetição para inserir todos os registros
        for(var i in tbclientes){
           var cli = JSON.parse(tbClientes[i]);
           $("#tbListar tbody").append("<tr>"+
                                       " <td><img src='img/edit.png' alt='"+i+"' class='btnEditar'/><img src='img/delete.png' alt= '"+i+"' class='btnExcluir' /></td>" +
                                       " <td>"+cli.Chamado+"</td>" +
                                       " <td>"+cli.DataChamado+"</td>" +
                                       " <td>"+cli.HoraChamado+"</td>" +
                                       " <td>"+cli.Categoria+"</td>" +
                                       " <td>"+cli.desProblema+"</td>" +
                                       " <td>"+cli.Usuario+"</td>" +
                                       " <td>"+cli.Prioridade+"</td>" +
                                       " <td>"+cli.Status+"</td>" +
                                       "</tr>");
        }
        
     }
           
     // função para excluir registros
        function Excluir(){
     tbClientes.splice(indice_selecionado, 1);
     localStorage.setitem("tbClientes", JSON.stringify(tbClientes));
      alert("Registro excluído");
     }    

      //Função para pesquisar Cliente
      function GetCliente(propriedade, valor){
     var cli = null;
     for (var item in tbClientes){
         var i = JSON.parse(tbClientes[item]);
         if (i[propriedade] == valor)
         cli = i;

     }
     return cli;
      }


    //Chamado da função listar clientes
   Listar();

  //Ação com base nos eventos do formulário

   $("#form").on("submit", function(){
    if(operacao == "A")
       return Adicionar();

       else
        return Editar ();

  });
    
   //Ação com base nos eventos de botao editar

  $("#tbListar").on("click", ".btnEditar", function(){
    operacao = "E";
    indice_selecionado = parseInt($(this).attr("alt"));
    var cli = JSON.parse(tbClientes[indice_selecionado]);
    $ ("#chamado").val(cli.chamado),
    $("#datChamado").val(cli.datChamado),
    $("#horChamado").val(cli.horChamado),
    $("#categoria").val(cli.categoria),
    $("#desProblema").val(cli.desProblema),
    $("#usuAbertura").val(cli.UsuAbertura),
    $("#prioridade").val(cli.prioridade),
    $("#status").val(cli.status);
    $("#chamado").attr("readonly", "readonly"); //IMPORTANTE: ENTENDER COM O PROFESSOR COMO FICARIA AQUI
    $("#usuAbertura").focus(); //IMPORTANTE: ENTENDER COM O PROFESSOR COMO FICARIA AQUI


  });

  // Ação com base nos eventos do botão excluir
  $ ("#tbListar").on("Click", ".btnExcluir", function(){
   indice_selecionado = parseInt($(this).attr("alt"));
   Excluir();
   Listar();

  });

});