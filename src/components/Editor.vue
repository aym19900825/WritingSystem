<template>  
        <textarea :id="id" :value="value"></textarea>  
</template>   
<script>  
    import tinymce from 'tinymce/tinymce';  
    import 'tinymce/themes/modern/theme';  
    import 'tinymce/plugins/paste';  
    import 'tinymce/plugins/link';  
  
    const INIT = 0;  
    const CHANGED = 2;  
    var EDITOR = null;  
    export default {  
        props: {  
            value: {  
                type: String,  
                required: true  
            },  
            setting: {}  
        },  
        watch: {  
            value: function (val) {  
                console.log('init ' + val)  
                if (this.status == INIT || tinymce.activeEditor.getContent() != val){  
                    tinymce.activeEditor.setContent(val);  
                }  
                this.status = CHANGED  
            }  
        },  
        data: function () {  
            return {  
                status: INIT,  
                id: 'editor-'+new Date().getMilliseconds(),  
            }  
        },  
        methods: {  
  
        },  
        mounted: function () {  
            const _this = this;  
            const setting =  
                {  
                    selector:'#'+_this.id,  
                    language:"../../static/tinymce/zh_CN",  
                    init_instance_callback:function(editor) {  
                        EDITOR = editor;  
                        console.log("Editor: " + editor.id + " is now initialized.");  
                        editor.on('input change undo redo', () => {  
                            var content = editor.getContent()  
                            _this.$emit('input', content);  
                        });  
                    },  
                    height: 500,
                    theme: 'modern',
                    toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
                    image_advtab: true,
                    templates: [
                        { title: 'Test template 1', content: 'Test 1' },
                        { title: 'Test template 2', content: 'Test 2' }
                    ],
                    content_css: [
                        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                        '//www.tinymce.com/css/codepen.min.css'
                  ]
                };  
            Object.assign(setting,_this.setting)  
            tinymce.init({
                  selector: 'textarea',
                  height: 500,
                  theme: 'modern',
                  plugins: 'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount tinymcespellchecker a11ychecker imagetools mediaembed  linkchecker contextmenu colorpicker textpattern help',
                  toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
                  image_advtab: true,
                  templates: [
                    { title: 'Test template 1', content: 'Test 1' },
                    { title: 'Test template 2', content: 'Test 2' }
                  ],
                  content_css: [
                    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                    '//www.tinymce.com/css/codepen.min.css'
                  ]
             });
        },  
        beforeDestroy: function () {  
            tinymce.get(this.id).destroy();  
        }  
    }  
      
</script>  
<style scoped>
</style>

