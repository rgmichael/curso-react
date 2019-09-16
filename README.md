 (function(){
	'use strict';

	angular.module('app.main').controller('MainCtrl', MainCtrl);

	MainCtrl.$inject = ['MainFactory','ContasFactory','httpInterceptor', 'ContasService', 'ElementosFactory', 'RotasFactory', 'MessageService', 'ClientesFactory', 'ValidatorCepService', 'deviceDetector', '$http', '$rootScope', '$cookies', '$state', '$scope'];

	function MainCtrl(MainFactory, ContasFactory, httpInterceptor, ContasService, ElementosFactory, RotasFactory, MessageService, ClientesFactory, ValidatorCepService, deviceDetector,  $http, $rootScope, $cookies, $state, $scope){

		var vm = this;
		vm.consultarRotas = ConsultarRotas;
		vm.prepararParaRotas = PrepararParaRotas;
		vm.prepararParaGeocercas = PrepararParaGeocercas;
		vm.prepararParaRastreamentos = PrepararParaRastreamentos;
		vm.consultarTiposAssociadosElementos = ConsultarTiposAssociadosElementos;
		vm.consultaGenerica = ConsultaGenerica;
		vm.acionarRota= AcionarRota;
		vm.inibirComboRota = InibirComboRota;
		vm.acionarGeocerca=AcionarGeocerca;
		vm.exibeComboRota=false;
		vm.liberaBotaoGeocerca=false;
		vm.exibirRotas=false;
		vm.parametroLargura='';
		vm.userEmail = $cookies.get('userEmail');	

		vm.tab = 1;

		vm.trocarformulario = trocarformulario;



		vm.dados = deviceDetector;
    	vm.allData = JSON.stringify(vm.dados, null, 2);
    	AjustarTamanhoBrowse();


		//pega a largura da resolução da tela
		vm.width = parseInt((screen.width - (screen.width * vm.parametroLargura)),10);
		//vm.width = parseInt((screen.width - (screen.width * 0.02)),10); -- Código Original
		//pega a altura da resolução da tela
		vm.alturaMaps = parseInt((screen.height - (screen.height * 0.270)),10);
		
 		// var windowWidth = $(window).width();
 		// vm.width = parseInt((windowWidth - (windowWidth * 0.2)),10);
 		// var windowHeight = $(window).height();
 		// vm.height = parseInt((windowHeight - (windowHeight * 0.2)),10);
 		// // windowWidth & windowHeight are automatically updated when the browser size is modified		

		vm.tipoDeRenderizacao = '';
		vm.dtInicio = moment().subtract(1, 'hours');
        vm.dtFim = moment();
        vm.mostrarBtnConsulta = false;
        vm.trocarImagemRota = TrocarImagemRota;
        vm.trocarImagemGeocerca = TrocarImagemGeocerca;
                
		InstanciarControllerElementos();
		InstanciarControllerRotas();
		InstanciarRenderizadorMaps();
		InstaciarControllerParamRotas();
		ListarElementos();				
		ConsultarRotas();

		function AjustarTamanhoBrowse()
		{			

			if (vm.dados.browser=='chrome' && vm.dados.os=='windows')
			{
				vm.parametroLargura = 0.02;
			}
			else if (vm.dados.browser=='chrome' && vm.dados.os=='linux')
			{
				vm.parametroLargura = 0.18;			
			}
			else if (vm.dados.browser=='chrome' && vm.dados.os=='android')
			{
				vm.parametroLargura = 0.04;						
			}
			else if (vm.dados.browser=='firefox' && vm.dados.os=='windows')
			{
				vm.parametroLargura = 0.02;
			}		
			else if (vm.dados.browser=='firefox' && vm.dados.os=='linux')
			{
				vm.parametroLargura = 0.12;
			}
			else if (vm.dados.browser=='firefox' && vm.dados.os=='android')
			{
				vm.parametroLargura = 0.04;
			}
			else if (vm.dados.browser=='ie' && vm.dados.os=='windows')
			{
				vm.parametroLargura = 0.02;	
			}
			
		}

		
			
		function InstanciarControllerElementos(){
			vm.elementos = {
				token: '',
				idCliente: 0,
				id: '',
				tipoElemento: '',
				identificacao: '',
				ativosRastreador: '',
				status: 'A',
				fgRetornaRastreadores: '',
				fgRetornaGeocercas: '',
				fgRetornaRotas: ''
			};

			HideAllComboBox();
		}

		function InstanciarControllerRotas(){
			vm.rotas = {
				token: '',
				idCliente: 0,
				idElemento: 0,
				idRota: 0,
				dataInicio: '',
				dataFim: '',
				resolucaoV: '',
				resolucaoH: ''
			};
		}

		function InstaciarControllerParamRotas(){

			vm.rotasParametros={
				token:ContasService.getToken(),
				idCliente:$cookies.get('userClienteId'),
				id:'',
				idElementoRemove:'',
				fgRetornoMinimo:'S'
			};

			vm.listaRotas=[];
		}

		function InstanciarControllerGeocercas(){
			vm.geocercas = {
				geo: ''
			};
		}

		function InstanciarControllerRastreamentos(){
			vm.rastreamentos = {
				rastr: ''
			};
		}	

		function InstanciarRenderizadorMaps(){
			vm.renderMaps = {
				token: '',
				idCliente: '',
				idElemento: '',
				idRota: '',
				dataInicio: '',
				dataFim: '',
				resolucaoV: vm.alturaMaps,
				resolucaoH: vm.width,
				fgOnline: ''
			};
		}

		function TrocarImagemRota(id, img)
		{	
			document.getElementById("imagem").src=img;
		}

		function TrocarImagemGeocerca(id)
		{	
			if (vm.liberaBotaoGeocerca==true) //Após a consulta já realizada, essa função pode ser liberada.
			{
				//document.getElementById("imagem2").src=img;
				
				if(vm.exibirRotas==false)
				{
					enableGeofence(vm.exibirRotas);
					vm.exibirRotas=true;
					document.getElementById("imagem2").src='../contents/img/geocerca.png';										
				}
				else
				{
					enableGeofence(vm.exibirRotas);
					vm.exibirRotas=false;
					document.getElementById("imagem2").src='../contents/img/geocerca_press.png';	
				}
			}
		}

		function ReestabelecerImagens()
		{
			document.getElementById("imagem").src="../contents/img/rota.png";
			document.getElementById("imagem2").src="../contents/img/geocerca.png";
		}

		function ListarElementos(){

			vm.elementos.token = ContasService.getToken();
			vm.elementos.idCliente = $cookies.get('userClienteId');			
			ElementosFactory.buscarElemento(vm.elementos)
			.then(function(response){
				vm.lista = response.resultado;

				if(vm.lista.length == 0){
					MessageService.mensagemInfo('Nenhum elemento cadastrado!', 'Aviso');
				}
			})
			.catch(function(e){
				// MessageService.mensagemErro(e.mensagem, 'Atenção');
			});
		}

		function PrepararElementos(tipoRetorno){
			vm.mostrarComboBoxElementos = true;
			vm.cmbElemento = '';

			vm.elementos.token = ContasService.getToken();
			vm.elementos.idCliente = $cookies.get('userClienteId');
			
			if(tipoRetorno == 'rastreamento'){
				vm.elementos.fgRetornaRastreadores = 'S';				
			}else if(tipoRetorno == 'geocerca'){				
				vm.elementos.fgRetornaGeocercas = 'S';				
			}else{				
				vm.elementos.fgRetornaRotas = 'S';
			}			
		}

		function PrepararParaRotas(){
			
			HideAllComboBox();			
			PrepararElementos('rota');			
			vm.tipoDeRenderizacao = 'rota';

			if (vm.exibeComboRota==false){
				vm.exibeComboRota=true;
				vm.elementos.fgRetornaRotas = 'S';
				//vm.elementos.idRota=vm.listaRotasList;				
			}
			else{
				vm.exibeComboRota=false;
				vm.elementos.fgRetornaRotas = 'N';
				//vm.elementos.idRota='';
			}
		}

		function PrepararParaGeocercas(){
			//console.log('geo');
			HideAllComboBox();
			PrepararElementos('geocerca');
			//vm.mostrarComboBoxGeocercas = true;
			vm.tipoDeRenderizacao = 'geocerca';
		}

		function PrepararParaRastreamentos(){
			//console.log('rastr');
			HideAllComboBox();
			PrepararElementos('rastreamento');
			//vm.mostrarComboBoxRastreamentos = true;
			vm.tipoDeRenderizacao = 'rastreamento';
		}

		function HideAllComboBox(){
			vm.mostrarComboBoxElementos = false;
			vm.mostrarComboBoxRotas = false;
			vm.mostrarComboBoxGeocercas = false;
			vm.mostrarComboBoxRastreamentos = false;
		}

		function ConsultarRotas(){
			RotasFactory.buscarRota(vm.rotasParametros)
			.then(function(response){
				vm.listaRotas = response.resultado;
				if(vm.listaRotas.length==0){
					MessageService.mensagemInfo('Nenhuma rota cadastrada!', 'Aviso');
				}
			})
			.catch(function(e){
				// MessageService.mensagemErro(e.mensagem, 'Atenção');
			});

			//cleanMap();

			/*vm.rotas.token = ContasService.getToken(); //$rootScope.token;
			vm.rotas.idCliente = $rootScope.userClienteId;
			vm.rotas.idElemento = 27; //vm.elementos.id;
			vm.rotas.idRota = 119;
			vm.rotas.dataInicio = '01/01/2016 00:00:00';
			vm.rotas.dataFim = '01/01/2018 00:00:00';
			vm.rotas.resolucaoV = 540;
			vm.rotas.resolucaoH = 1300;

			console.log(vm.rotas);

			MainFactory.renderizarRotas(vm.rotas)
			.then(function(response){
				console.log('chamou certo');
				console.log(response);

				$("#mapMain_canvas").html(response);
				//initRotas(response);
			})
			.catch(function(e){
				console.log(e);
				//console.log('deu erro');
			});*/
		}

		function ConsultarGeocercas(){
			//implementation geo
			//implementation geo
		}

		function ConsultarRastreadores(){
			//implementation rastr
			//implementation rastr
		}

		function AcionarRota(objRota){
			if(objRota)
			{
				//vm.elementos.idRota=objRota;						
			}
		}

		function InibirComboRota(objRota){
			vm.exibeComboRota=false;	

			if(objRota)
			{
				//vm.elementos.idRota=objRota;
				ConsultaGenerica();	
			}
		}

		function AcionarGeocerca(){	

			vm.elementos.fgRetornaGeocercas='S';			
		}

		function ConsultarTiposAssociadosElementos(objElemento){

			if(objElemento){
				var elementosItens = JSON.parse(objElemento);				
				vm.elementos.id = elementosItens.id;
				vm.elementos.token = ContasService.getToken();
				vm.elementos.idCliente = $cookies.get('userClienteId');

				console.log("E l e m e n t o s");
				console.log(vm.elementos);

				ElementosFactory.buscarElemento(vm.elementos)
				.then(function(response){
					vm.listaElementoRota = response.resultado;
					if(vm.listaElementoRota.length == 0){
						MessageService.mensagemInfo('Nenhum elemento cadastrado!', 'Aviso');
					}
				})
				.catch(function(e){
					MessageService.mensagemErro(e.mensagem, 'Atenção');
				});
			
				var realTime = document.getElementById("realTime").checked;
				if(realTime) {
					realTime = 'S'
				}

				vm.mostrarBtnConsulta = true;
				vm.renderMaps.token = ContasService.getToken();
				vm.renderMaps.idCliente = $cookies.get('userClienteId');
				vm.renderMaps.idElemento = elementosItens.id; //'27';			
				vm.renderMaps.dataInicio = vm.dtInicio.format('DD/MM/YYYY HH:mm:ss');
				vm.renderMaps.dataFim = vm.dtFim.format('DD/MM/YYYY HH:mm:ss');
				vm.renderMaps.idRota = vm.listaRotasList;
				vm.renderMaps.fgOnline = realTime;
				vm.renderMaps.visual = "R";
				//vm.elementos.idRota;

				// if ((elementosItens.hasOwnProperty("rotas"))==true){
				// 	//vm.renderMaps.idRota = vm.listaElementoRota.rotas[0].id; //'119';
				// 	vm.renderMaps.idRota = vm.elementos.idRota;
				// 	console.log("existe rota");
				// }			

				vm.mostrarBtnConsulta = true;
				// console.log(vm.renderMaps);
			}
		}

		function ConsultaGenerica(){

			
			ConsultarTiposAssociadosElementos(vm.elementoItensList);
			

			MainFactory.renderizarRotas(vm.renderMaps)
			.then(function(response){
				console.log('------')
				console.log(response);
				console.log('------')
				//esconde maps inicial
				var display = document.getElementById('map').style.display;
		        if(display == "none"){
		        	document.getElementById('map').style.display = 'block';
		        }
		        else{
		        	document.getElementById('map').style.display = 'none';
		        }

				$("#mapMain_canvas").html(response);
			})
			.catch(function(e){
				if(e.codigo == '005'){
					MessageService.mensagemInfo(e.mensagem, 'Atenção');
				}else{
					MessageService.mensagemErro(e.mensagem, 'Atenção');
				}
			});

			ReestabelecerImagens();
			vm.exibeComboRota=false;
			//vm.elementos.idRota='';
			ConsultarRotas();
			vm.liberaBotaoGeocerca=true;	
		}

		

		/*** INÍCIO - GOOGLE MAPS ***/
		var map;
		var endereco;
		var existeEnd = false;
		var latlng;
	    var options = {
	        zoom: 0,
	        center: '',
	        mapTypeId: ''
	    };
	    var geocoder = new google.maps.Geocoder();

		document.getElementById('map').style.height = vm.alturaMaps+'px';
		document.getElementById('map').style.width = vm.width+'px';//comando novo 8/10/17

		vm.objBuscaEnd = {
			"token": ContasService.getToken(),
    		"id" : $cookies.get('userId'),
    		"status" : "A",
		    "fgRetornoMinimo" : "N"
		}
	
		ClientesFactory.buscarCliente(vm.objBuscaEnd)
		.then(function(resp){
			if(resp.resultado[0].enderecoPostal){
				var objCep = {
		    		cep: resp.resultado[0].enderecoPostal.cep
		    	};

		    	ValidatorCepService.validarCep(objCep)
		    	.then(function(response){
	    			endereco = response.data.resultado.tipoLogradouro + ' ' + response.data.resultado.logradouro + ' ' + response.data.resultado.bairro + ', ' + response.data.resultado.cidade;
	    			existeEnd = true;
				    
					geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
						  if (results[0]) {
						    var latitude = results[0].geometry.location.lat();
						    var longitude = results[0].geometry.location.lng();
						    latlng = new google.maps.LatLng(latitude, longitude);

						    options = {
						        zoom: 13,
						        center: latlng,
						        mapTypeId: google.maps.MapTypeId.ROADMAP
						    };

						    map = new google.maps.Map(document.getElementById("map"), options);
						  }
						}else{
							//MessageService.mensagemAtencao('Endereço não encontrado!', 'Atenção');
						}
					});
	    		})
		    	.catch(function(e){
	    		});
			}
			
		})
		.catch(function(e){
		})
		.finally(function(){
			if(!existeEnd){
				latlng = new google.maps.LatLng(-16, -54);
			    options = {
			        zoom: 4,
			        center: latlng,
			        mapTypeId: google.maps.MapTypeId.ROADMAP
			    };

			    map = new google.maps.Map(document.getElementById("map"), options);
			}
		});
		

	    //funções para atender ROTAS
		function initRotas(objRender) {
			//document.getElementById('map_canvas').innerHTML("");

			//$scope.mapsDiv = objRender;
			//console.log(objRender);
			/*ngDialog.openConfirm({
				template: objRender,
				className: 'ngdialog-theme-default'
			})
			.then(function(success){
				console.log('sucesso');
			}, function(e){
				console.log('falha');
			});*/
			//directionsDisplay = new google.maps.DirectionsRenderer(); // Instanciando...
			/*var latlng = new google.maps.LatLng(-18.8800397, -47.05878999999999);

			var options = {
				zoom: 5,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			map = new google.maps.Map(document.getElementById("mapa"), options);
			directionsDisplay.setMap(map); // Relacionamos o directionsDisplay com o mapa desejado

			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) { // Se deu tudo certo
					directionsDisplay.setDirections(result); // Renderizamos no mapa o resultado
				}
			});*/
		}
		//funções para atender GEOCERCAs
		/*function adicionarRaio(value){
			var raio = parseInt(value);

			circle = new google.maps.Circle({
				strokeColor: '#000000',
				strokeOpacity: 0.8,
				strokeWeight: 1.5,
				fillColor: '#00FF00',
				fillOpacity: 0.35,
				map: map,
				radius: raio
			});

			circle.bindTo('center', marker, 'position');
		}

	    //funções para limpar maps
		function cleanMap() {
			setAllMap(null);//limpa markers
			cleanCircle();//limpa geocercas
			cleanRoutes();//limpa rotas
		}
		function setAllMap(map) {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
			}
		}
		function cleanCircle(){
			if(circle !== undefined){
				circle.setMap(null);
			}
		}
		function cleanRoutes(){
			//directionsDisplay.setDirections(null);
			//directionsDisplay.setMap(null);
		}*/
		$scope.telaVideo = function(){
			if($('.telaVideo').hasClass('block')) {
				$('.telaVideo').removeClass('block');
				$('.telaVideo').addClass('none');
			}else {
				$('.telaVideo').addClass('block');
				$('.telaVideo').removeClass('none');
			}
		}


		function trocarformulario(tipo){

			alert(vm.tab)
			

			if(tipo=='1'){

				vm.tab=1;
				document.getElementById('dataHora').style.display = 'block';
				
			}
			if(tipo=='2'){
				vm.tab=2;
				document.getElementById('dataHora').style.display = 'none';
			}

		}

		

		/*** FIM - GOOGLE MAPS ***/
		
	};


})();
