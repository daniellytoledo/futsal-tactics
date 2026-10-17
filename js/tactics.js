/*
 * As jogadas ficam separadas da interface. Para criar uma nova tática,
 * duplica um objeto e define os pontos (x,y) de cada jogador em cada etapa.
 * Coordenadas SVG: x entre 28 e 612; y entre 28 e 372.
 */
const TACTICS = [
  {
    id: 'rotacao-ala', title: 'Rotação na ala', category: 'Ataque', duration: '4 etapas',
    summary: 'Criar espaço com largura, rotação e uma desmarcação.',
    note: 'Manter a largura e oferecer sempre duas linhas de passe ao portador da bola.',
    players: [
      { id:'GR', name:'Guarda-redes', color:'#d9f36a', role:'Inicia a construção', detail:'Joga curto e procura o passe seguro.' },
      { id:'2', name:'Ala direito', color:'#b9dcff', role:'Dá largura', detail:'Abre junto à linha e prepara a desmarcação.' },
      { id:'3', name:'Ala esquerdo', color:'#b9dcff', role:'Faz a rotação', detail:'Cruza para trocar de posição e libertar espaço.' },
      { id:'4', name:'Fixo', color:'#b9dcff', role:'Apoia por trás', detail:'Garante equilíbrio e uma linha de passe de segurança.' },
      { id:'5', name:'Pivot', color:'#b9dcff', role:'Ataca o espaço', detail:'Procura receber entre linhas ou no segundo poste.' }
    ],
    steps: [
      { title:'Abrir a ala', description:'O jogador 2 abre junto à linha lateral para criar uma linha de passe segura. O fixo mantém-se atrás da bola para dar apoio.', ball:[160,330], positions:{GR:[160,347],'2':[100,260],'3':[250,150],'4':[240,280],'5':[430,145]}, paths:[{from:'2',to:[100,260]},{from:'3',to:[250,150]}], pass:null, focus:['2','4'], note:'Começar com calma: primeiro criar largura e linhas de passe.' },
      { title:'Passe para a ala', description:'O guarda-redes passa ao jogador 2. O jogador 3 prepara a rotação para arrastar a marcação e abrir um corredor.', ball:[100,260], positions:{GR:[160,347],'2':[100,260],'3':[310,205],'4':[240,280],'5':[430,145]}, paths:[{from:'3',to:[310,205]}], pass:{from:[160,330],to:[100,260]}, focus:['GR','2','3'], note:'O passe deve chegar ao pé mais afastado da pressão.' },
      { title:'Rotação e desmarcação', description:'O jogador 3 cruza para a zona central. O pivot 5 ataca o espaço criado, enquanto o fixo 4 mantém cobertura.', ball:[100,260], positions:{GR:[160,347],'2':[170,220],'3':[310,205],'4':[240,280],'5':[480,205]}, paths:[{from:'2',to:[170,220]},{from:'5',to:[480,205]}], pass:{from:[100,260],to:[170,220]}, focus:['2','3','5'], note:'A rotação só funciona se os movimentos forem coordenados e decididos.' },
      { title:'Procurar a finalização', description:'O jogador 2 procura o passe para o pivot ou a entrada do jogador 3. O jogador do lado contrário prepara-se para atacar o segundo poste.', ball:[170,220], positions:{GR:[160,347],'2':[170,220],'3':[360,150],'4':[240,280],'5':[480,205]}, paths:[{from:'3',to:[360,150]},{from:'5',to:[480,205]}], pass:{from:[170,220],to:[480,205]}, focus:['2','3','5'], note:'Se não houver linha de remate, conservar a bola e reiniciar a organização.' }
    ]
  },
  {
    id:'canto-curto', title:'Canto curto', category:'Bolas paradas', duration:'3 etapas',
    summary:'Criar uma opção curta e libertar o passe para a zona de finalização.',
    note:'Combinar o sinal de início e evitar que dois jogadores ocupem o mesmo corredor.',
    players:[
      {id:'GR',name:'Guarda-redes',color:'#d9f36a',role:'Equilíbrio atrás',detail:'Mantém-se como apoio de segurança.'},
      {id:'2',name:'Marcador',color:'#b9dcff',role:'Executa o canto',detail:'Joga curto e movimenta-se para receber de volta.'},
      {id:'3',name:'Apoio curto',color:'#b9dcff',role:'Atrai a pressão',detail:'Aproxima-se e devolve ou roda o jogo.'},
      {id:'4',name:'Bloqueio legal',color:'#b9dcff',role:'Liberta o corredor',detail:'Faz um movimento de desmarcação sem contacto ilegal.'},
      {id:'5',name:'Segundo poste',color:'#b9dcff',role:'Ataca a baliza',detail:'Temporiza a entrada para a zona de finalização.'}
    ],
    steps:[
      {title:'Preparar o canto',description:'O jogador 2 posiciona-se junto à bola. O jogador 3 oferece uma opção curta e os restantes distribuem-se pela área.',ball:[72,65],positions:{GR:[160,347],'2':[72,65],'3':[145,100],'4':[250,140],'5':[480,230]},paths:[],pass:null,focus:['2','3'],note:'Confirmar o sinal combinado antes de iniciar.'},
      {title:'Jogar curto',description:'O jogador 2 passa ao jogador 3 e faz imediatamente uma desmarcação para receber de volta ou abrir um novo ângulo.',ball:[145,100],positions:{GR:[160,347],'2':[120,75],'3':[145,100],'4':[300,145],'5':[480,230]},paths:[{from:'2',to:[120,75]}],pass:{from:[72,65],to:[145,100]},focus:['2','3'],note:'O passe curto deve ser firme e a desmarcação imediata.'},
      {title:'Atacar a área',description:'O jogador 4 ataca o espaço livre e o jogador 5 temporiza a entrada ao segundo poste. O portador decide entre passe tenso ou remate.',ball:[145,100],positions:{GR:[160,347],'2':[120,75],'3':[145,100],'4':[385,185],'5':[520,200]},paths:[{from:'4',to:[385,185]},{from:'5',to:[520,200]}],pass:{from:[145,100],to:[385,185]},focus:['3','4','5'],note:'Atacar a bola sem parar o movimento antes do passe.'}
    ]
  },
  {
    id:'saida-pressao', title:'Saída de pressão', category:'Ataque', duration:'3 etapas',
    summary:'Usar apoios próximos para sair da primeira linha de pressão.',
    note:'Se a progressão estiver fechada, reciclar a posse em vez de forçar um passe.',
    players:[
      {id:'GR',name:'Guarda-redes',color:'#d9f36a',role:'Inicia a saída',detail:'Lê a pressão e escolhe o apoio livre.'},
      {id:'2',name:'Ala direito',color:'#b9dcff',role:'Abre na linha',detail:'Dá largura e cria uma linha de passe.'},
      {id:'3',name:'Ala esquerdo',color:'#b9dcff',role:'Apoio central',detail:'Aproxima-se para oferecer um passe de segurança.'},
      {id:'4',name:'Fixo',color:'#b9dcff',role:'Equilibra',detail:'Mantém-se atrás da bola para permitir reciclar.'},
      {id:'5',name:'Pivot',color:'#b9dcff',role:'Prende a referência',detail:'Ocupa a frente e procura espaço entre linhas.'}
    ],
    steps:[
      {title:'Criar linhas de passe',description:'Os alas abrem o campo, o fixo mantém-se atrás da bola e o pivot oferece uma referência mais adiantada.',ball:[160,330],positions:{GR:[160,347],'2':[90,245],'3':[235,245],'4':[250,310],'5':[440,130]},paths:[{from:'2',to:[90,245]},{from:'3',to:[235,245]}],pass:null,focus:['2','3','4'],note:'Evitar que os dois apoios se escondam atrás do mesmo defensor.'},
      {title:'Atrair e soltar',description:'A bola entra no apoio mais próximo. O jogador do lado contrário mantém a largura para obrigar a equipa adversária a deslocar-se.',ball:[235,245],positions:{GR:[160,347],'2':[90,245],'3':[235,245],'4':[250,310],'5':[440,130]},paths:[{from:'2',to:[90,245]}],pass:{from:[160,330],to:[235,245]},focus:['GR','3','2'],note:'Atrair a pressão antes de mudar o centro do jogo.'},
      {title:'Progredir com apoio',description:'Depois de ultrapassar a primeira linha, procurar o pivot ou o ala livre. O fixo acompanha por trás para proteger uma eventual perda.',ball:[90,245],positions:{GR:[160,347],'2':[90,245],'3':[310,190],'4':[250,310],'5':[440,130]},paths:[{from:'3',to:[310,190]},{from:'5',to:[440,130]}],pass:{from:[235,245],to:[90,245]},focus:['2','3','5','4'],note:'Progredir com controlo e manter sempre cobertura atrás da bola.'}
    ]
  }
];
