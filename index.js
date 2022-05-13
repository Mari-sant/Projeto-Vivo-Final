$(function () {

  var operacao = "A"; //"A"=Adição; "E"=Edição

  var indice_selecionado = -1; // ao armazenar eles e listar ele vai estar

  var tbChamados = localStorage.getItem("tbChamados");// Recupera os dados armazenados

  tbChamados = JSON.parse(tbChamados); // Converte string para objeto

  if (tbChamados == null) // Caso não haja conteúdo, iniciamos um vetor vazio
    tbChamados = [];

  // Função para adicionar registros
  function Adicionar() {
    //variável para verificar se número de código já existe
    var cha = GetCliente("Codigo", $("#Codigo").val());
    // Caso existe é informado ao cliente
    if (cha != null) {
      alert("Código já cadastrado.");
      return;
    }
    // caso contrário insere
    var add = JSON.stringify({
      Codigo: $("#Codigo").val(),
      Data: $("#Data").val(),
      Horario: $("#Hora").val(),
      Categoria: $("#Categoria").val(),
      Problema: $("#Problema").val(),
      Usuario: $("#Usuario").val(),
      Prioridade: $("#Prioridade").val(),
      Status: $("#Status").val()
    });

    tbChamados.push(add);

    localStorage.setItem("tbChamados", JSON.stringify(tbChamados));

    alert("Chamado aberto com sucesso.");

    return true;
  }
  // Adicionar data automatica
  var data = new Date();

  // Guarda cada pedaço em uma variável
  var mes = data.getMonth();          // 0-11 (zero=janeiro)
  var dia = data.getDate();           // 1-31
  var dia_sem = data.getDay();            // 0-6 (zero=domingo)
  var ano2 = data.getYear();           // 2 dígitos
  var ano4 = data.getFullYear();       // 4 dígitos
  var hora = data.getHours();          // 0-23
  var min = data.getMinutes();        // 0-59
  var seg = data.getSeconds();        // 0-59
  var mseg = data.getMilliseconds();   // 0-999
  var tz = data.getTimezoneOffset(); // em minutos

  if (dia < 10) {
    dia = '0' + (dia);
  }

  if (mes < 10) {
    mes = '0' + (mes + 1);
  }

  // Formata a data e a hora (note o mês + 1)
  var str_data_teste = dia + '/' + mes + '/' + ano4; // Brasil
  var str_data_Brazil = ano4 + '-' + mes + '-' + dia; // europeu
  // Mostra o resultado
  // alert('Hoje é ' + str_data + ' às ' + str_hora);
  $("#Data").val(str_data_Brazil);

  var str_hora = hora + ':' + min + ':' + seg;
  $("#Hora").val(str_hora);

  // Função para editar chamados
  function Editar() {
    tbChamados[indice_selecionado] = JSON.stringify({
      Codigo: $("#Codigo").val(),
      Data: $("#Data").val(),
      Horario: $("#Hora").val(),
      Categoria: $("#Categoria").val(),
      Problema: $("#Problema").val(),
      Usuario: $("#Usuario").val(),
      Prioridade: $("#Prioridade").val(),
      Status: $("#Status").val()
    });

    localStorage.setItem("tbChamados", JSON.stringify(tbChamados));
    alert("Informações editadas.")
    operacao = "A";
    return true;
  }
  // Função para listar chamados
  function Listar() {
    $("#tblListar").html("");
    $("#tblListar").html(
      "<thead>" +
      "	<tr>" +
      "<th></th>" +
      "	<th>Chamado</th>" +
      "	<th>Data</th>" +
      "	<th>Horário</th>" +
      "	<th>Categoria</th>" +
      "	<th>Problema</th>" +
      "	<th>Usuário</th>" +
      "	<th>Prioridade</th>" +
      "	<th>Status</th>" +
      "	</tr>" +
      "</thead>" +
      "<tbody>" +
      "</tbody>"
    );

    // Malha de repetição para inserir todos os registros
    for (var i in tbChamados) {
      var cli = JSON.parse(tbChamados[i]);
      $("#tblListar tbody").append("<tr>" +
        "	<td><img src='/img/edit.png' alt='" + i + "' class='btnEditar'/><img src='/img/delete.png' alt='" + i + "' class='btnExcluir'/></td>" +
        "	<td>" + cli.Codigo + "</td>" +
        "	<td>" + cli.Data + "</td>" +
        "	<td>" + cli.Horario + "</td>" +
        "	<td>" + cli.Categoria + "</td>" +
        "	<td>" + cli.Problema + "</td>" +
        "	<td>" + cli.Usuario + "</td>" +
        "	<td>" + cli.Prioridade + "</td>" +
        "	<td>" + cli.Status + "</td>" +
        "</tr>");
    }
  }
  // Função para excluir registros

  function Excluir() {
    var resposta = confirm("Deseja excluir esse chamado?");
    if (resposta == true) {
      tbChamados.splice(indice_selecionado, 1);
      localStorage.setItem("tbChamados", JSON.stringify(tbChamados));
      alert("Chamado excluído com sucesso.");
    }
  }


  // Função par pesquisar cliente
  function GetCliente(propriedade, valor) {
    var cli = null;
    for (var item in tbChamados) {
      var i = JSON.parse(tbChamados[item]);
      if (i[propriedade] == valor)
        cli = i;
    }
    return cli;
  }

  // Chamada da função listar chamados
  Listar();

  // Ação com base nos eventos de formulário
  $("#frmChamado").on("submit", function () {
    if (operacao == "A")
      return Adicionar();
    else
      return Editar();
  });
  // Ação com base nos eventos do botão Editar
  $("#tblListar").on("click", ".btnEditar", function () {
    operacao = "E";
    indice_selecionado = parseInt($(this).attr("alt"));
    var cli = JSON.parse(tbChamados[indice_selecionado]);
    $("#Codigo").val(cli.Codigo);
    $("#Data").val(cli.Data);
    $("#Hora").val(cli.Hora);
    $("#Categoria").val(cli.Categoria);
    $("#Problema").val(cli.Problema);
    $("#Usuario").val(cli.Usuario);
    $("#Prioridade").val(cli.Prioridade);
    $("#Status").val(cli.Status);
    $("#Codigo").attr("readonly", "readonly");
    $("#Nome").focus();
  });

  // Código automatico

  var ultimo = JSON.parse(tbChamados.slice(-1));
  var ultconv = parseInt(ultimo.Codigo);
  $("#Codigo").val(ultconv + 1);


             
  
  
  // Status
  // if (pessoa == "Wilson") {
  //   $("#txtStatus").val('Em aberto');
  //   } else
  //   $("#txtStatus").val('Em andamento');
  //   });
    
    /* Ação com base nos eventos do botão novo
    $( "#btnNovo").click(function() {
    
    $("#txtNome").prop('disabled', false);
    $("#txtTelefone").prop('disabled', false);

    
    $("#txtEmail").prop('disabled', false);
    
     });*/
    

  // Ação com base nos eventos do botão Excluir
  $("#tblListar").on("click", ".btnExcluir", function () {
    indice_selecionado = parseInt($(this).attr("alt"));
    Excluir();
    Listar();




    /* Ação com base nos eventos do botão novo
    $( "#btnNovo").click(function() {
    
     $("#txtNome").prop('disabled', false);
     $("#txtTelefone").prop('disabled', false);
    $("#txtEmail").prop('disabled', false);
    
     });*/


    // Obtém a data/hora atual

  });



});