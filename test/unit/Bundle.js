describe("Bundle", function() {
    var bundle;
    
    describe("Create", function() {
        describe("with default values", function() {

            beforeEach(function() {
                bundle = Ext.create('elmasse.i18n.Bundle');
            });
            
            afterEach(function() {
                bundle.destroy();
            });

            it("should create bundle", function() {
                expect(bundle).toBeDefined();
            });
            
            it("should have default config values on creation", function(){
                var cfg = bundle.config;
                expect(cfg.bundle).toEqual('message');
                expect(cfg.enableLinkedValues).toEqual(false);
                expect(cfg.format).toEqual('property');
                expect(cfg.path).toEqual('resources');
                expect(cfg.noCache).toEqual(true);
            });

            it("should set proxy config values", function(){
                checkProxyConfiguration();
            });

        });

        describe("with params", function() {
            var params = {
                language: 'es-ES',
                format: 'json',
                path: 'files',
                bundle: 'Application',
                
            };
            
            beforeEach(function(){
                bundle = Ext.create('elmasse.i18n.Bundle', params);
            });
            
            it("should create bundle", function() {
                expect(bundle).toBeDefined();
            });
            
            it("should have default config values on creation", function() {
                var cfg = bundle.config;
                expect(cfg.bundle).toEqual(params.bundle);
                expect(cfg.enableLinkedValues).toEqual(false);
                expect(cfg.format).toEqual(params.format);
                expect(cfg.path).toEqual(params.path);
                expect(cfg.noCache).toEqual(true);
            });

            it("should set proxy config values", function() {
                checkProxyConfiguration();
            });

        });
        
        function checkProxyConfiguration() {
            var proxy = bundle.getProxy(),
                path = bundle.getPath(),
                file = bundle.getBundle(),
                lang = bundle.getLanguage(),
                format = bundle.getFormat(),
                noCache = bundle.getNoCache(),
                fileExt = bundle.getResourceExtension(),
                url = path + '/' + file + '_' + lang + fileExt;
            
            expect(proxy.url).toEqual(url);
            expect(proxy.noCache).toEqual(noCache);
            expect(proxy.getReader().type).toEqual('i18n.'+ format);            
        } 

    });

    describe("Load .properties file", function() {
        describe(".properties language file exists", function() {
            var bundle,
                params = {
                    language: 'en-US',
                    path: 'resources',
                    bundle: 'Application',
                    noCache: false,
                    asynchronousLoad: false // this is needed to avoid issues with ajax mocks
                };
                
            beforeEach(function(done) {
                bundle = Ext.create('elmasse.i18n.Bundle', params);

                jasmine.Ajax.install();
                
                
                jasmine.Ajax
                    .stubRequest('resources/Application_en-US.properties')
                    .andReturn({
                        status: 200,
                        statusText: 'OK',
                        responseHeaders: [{name: 'content-type', value: 'text/plain'}],
                        responseText: 'key value'
                    });
                
                bundle.on('loaded', function() {
                    done();
                });                
                
                bundle.load();
            });
            
            afterEach(function() {
                jasmine.Ajax.uninstall();
                bundle.destroy();
            });

            it("should load correctly the file", function() {
                expect(bundle.getMsg('key')).toEqual('value');
            });
        });

        describe(".properties language file doesn't exist, then load parent", function() {
            var bundle,
                params = {
                    language: 'en-US',
                    path: 'resources',
                    bundle: 'Application',
                    noCache: false,
                    asynchronousLoad: false // this is needed to avoid issues with ajax mocks
                };
                
            beforeEach(function(done) {
                bundle = Ext.create('elmasse.i18n.Bundle', params);

                jasmine.Ajax.install();
                
                jasmine.Ajax
                    .stubRequest('resources/Application_en-US.properties')
                    .andReturn({
                        status: 404,
                        responseHeaders: [{name: 'content-type', value: 'text/plain'}]
                    });
                    
                jasmine.Ajax
                    .stubRequest('resources/Application.properties')
                    .andReturn({
                        status: 200,
                        statusText: 'OK',
                        responseHeaders: [{name: 'content-type', value: 'text/plain'}],
                        responseText: 'key value'
                    });
                
                bundle.on('loaded', function() {
                    done();
                });
                
              bundle.load(); 
            });
            
            afterEach(function() {
                jasmine.Ajax.uninstall();
                bundle.destroy();
            });

            it("should load correctly the file", function() {
                expect(bundle.getMsg('key')).toEqual('value');
            });
        });
        
        
    });

    describe("Load .json file", function() {
        describe(".json language file exists", function() {
            var bundle,
                params = {
                    language: 'en-US',
                    path: 'resources',
                    bundle: 'Application',
                    noCache: false,
                    format: 'json',
                    asynchronousLoad: false // this is needed to avoid issues with ajax mocks
                };
                
            beforeEach(function(done) {
                bundle = Ext.create('elmasse.i18n.Bundle', params);

                jasmine.Ajax.install();
                
                
                jasmine.Ajax
                    .stubRequest('resources/Application_en-US.json')
                    .andReturn({
                        status: 200,
                        statusText: 'OK',
                        responseHeaders: [{name: 'content-type', value: 'text/plain'}],
                        responseText: '{ "key": "value" }'
                    });
                
                bundle.on('loaded', function() {
                    done();
                });                
                
                bundle.load();
            });
            
            afterEach(function() {
                jasmine.Ajax.uninstall();
                bundle.destroy();
            });

            it("should load correctly the file", function() {
                expect(bundle.getMsg('key')).toEqual('value');
            });
        });

        describe(".json language file doesn't exist, then load parent", function() {
            var bundle,
                params = {
                    language: 'en-US',
                    path: 'resources',
                    bundle: 'Application',
                    noCache: false,
                    format: 'json',
                    asynchronousLoad: false // this is needed to avoid issues with ajax mocks
                };
                
            beforeEach(function(done) {
                bundle = Ext.create('elmasse.i18n.Bundle', params);

                jasmine.Ajax.install();
                
                jasmine.Ajax
                    .stubRequest('resources/Application_en-US.json')
                    .andReturn({
                        status: 404,
                        responseHeaders: [{name: 'content-type', value: 'text/plain'}]
                    });
                    
                jasmine.Ajax
                    .stubRequest('resources/Application.json')
                    .andReturn({
                        status: 200,
                        statusText: 'OK',
                        responseHeaders: [{name: 'content-type', value: 'text/plain'}],
                        responseText: '{ "key": "value" }'
                    });
                
                bundle.on('loaded', function() {
                    done();
                });
                
              bundle.load(); 
            });
            
            afterEach(function() {
                jasmine.Ajax.uninstall();
                bundle.destroy();
            });

            it("should load correctly the file", function() {
                expect(bundle.getMsg('key')).toEqual('value');
            });
        });

    });
    
    describe("Getting messages", function() {
        var bundle,
            params = {
                language: 'en-US',
                path: 'resources',
                bundle: 'Application',
                noCache: false,
                asynchronousLoad: false // this is needed to avoid issues with ajax mocks
            };
            
        beforeEach(function(done) {
            bundle = Ext.create('elmasse.i18n.Bundle', params);

            jasmine.Ajax.install();
            
            jasmine.Ajax
                .stubRequest('resources/Application_en-US.properties')
                .andReturn({
                    responseHeaders: [{name: 'content-type', value: 'text/plain'}],
                    responseText: '# this is a comment\n' +
                        'key=value\n' +
                        'other.key this is @linked\n' +
                        'linked enabled\n' + 
                        'not.found this @is.not.found\n' +
                        'formatted this contains a placeholder {0}'
                        
                });
                

            
            bundle.on('loaded', function() {
                done();
            });
            
          bundle.load(); 
        });
        
        afterEach(function() {
            jasmine.Ajax.uninstall();
            bundle.destroy();
        });
        
        it("should read all keys", function() {
            expect(bundle.getCount()).toEqual(5);
        });

        it("should not follow linked values by default", function() {
           expect(bundle.getMsg('other.key')).toEqual('this is @linked');
        });
        
        it("should follow linked values if enabled", function() {
           bundle.setEnableLinkedValues(true);
           expect(bundle.getMsg('other.key')).toEqual('this is enabled');
        });
        
        it("should not replace a linked value if not present", function() {
           bundle.setEnableLinkedValues(true);
           expect(bundle.getMsg('not.found')).toEqual('this @is.not.found');
        });
        
        it("should replace a formatted value if values passed", function() {
           expect(bundle.getMsg('formatted', ['text'])).toEqual('this contains a placeholder text');
        });
        it("should not replace a formatted value if no values passed", function() {
           expect(bundle.getMsg('formatted')).toEqual('this contains a placeholder {0}');
        });           
    });

    describe('lazy load definitions', function() {

        var bundle,
            params = {
                language: 'en-US',
                path: 'resources',
                bundle: 'Application',
                noCache: false,
                asynchronousLoad: false // this is needed to avoid issues with ajax mocks
            },
            value = 'VALUE';
            
        beforeEach(function(done) {
            bundle = Ext.create('elmasse.i18n.Bundle', params);

            jasmine.Ajax.install();
            
            jasmine.Ajax
                .stubRequest('resources/Application_en-US.properties')
                .andReturn({
                    responseHeaders: [{name: 'content-type', value: 'text/plain'}],
                    responseText: '# this is a comment\n' +
                        'key='+value+'\n'
                });
                

            
            bundle.on('loaded', function() {
                done();
            });
            
            bundle.load();
            elmasse.i18n.Bundle.instance = bundle;

        });
        
        afterEach(function() {
            jasmine.Ajax.uninstall();
            bundle.destroy();
            elmasse.i18n.Bundle.instance = undefined;
        });

        it('should get the message for key in {type: "bundle", key="key"} when creating a component', function(){
            var btn = Ext.create({
                xtype: 'button',
                text: { type: 'bundle', key: 'key'}
            });

            expect(btn.getText()).toEqual(value);
        });

        it('should get the message for key in {type: "bundle", key="key"} when defining a component', function(){
            var Btn = Ext.define(null, {
                extend: 'Ext.button.Button',
                text: { type: 'bundle', key: 'key'}
            });

            var btn = Ext.create(Btn);

            expect(btn.getText()).toEqual(value);
        });
    });

});
