# boot-phase
Phase boot management with generator, use co

    import boot from './lib/';
    
    /**
     * const b = boot();
     * Pre-phase array is not mandatory,
     * but they force phase order. 
     */
     
    const b = boot([
      'start',
      'connection',
      'middleware',
    ]);
    
    b.phase('start', function*() {
      console.log('start');
    });
    
    /*
    * phase `new` is not defined yiet,
    * this phase will be added after `middleware`.
    */
    b.phase('new', function*() {
      console.log('new phase 1');
    });
    
    b.phase('start', function*() {
      console.log('start 2');
    });
    
    b.phase('connection', function*() {
      console.log('connection phase 1');
    });
    
    b.phase('connection', function*() {
      console.log('connection phase 2');
    });
    
    b.phase('middleware', function*() {
      console.log('middleware phase 1');
    });
    
    b.phase('new', function*() {
      console.log('new phase 2');
    });
    
    b.phase('start', function*(){
    	console.log('start 3')
    })
    
    /*
    * start generator function is not mandatory.
    */
    b.start(function*() {
      console.log('final phase');
    }).then(console.log('it\'s over'));
    .catch(console.log('error during phase'));
    /**
    * Output: 
    *	start phase 1
    *	start phase 2
    * start phase 3
    *	connection phase 1
    *	connection phase 2
    *	middleware phase 1
    * new phase 1
    */
