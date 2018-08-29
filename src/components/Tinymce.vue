<template>
    <textarea :id="id" :value="value" @contextmenu.prevent="showMenu($event)" ></textarea>
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
            showMenu: function(){
                alert("aaaaaaaa");
            }
        },
        mounted: function () {
            const _this = this;
            const setting =
                {
                    selector:'#'+_this.id,
                    language_url: '../../static/tinymce/zh_CN.js',
                    init_instance_callback:function(editor) {
                        EDITOR = editor;
                        console.log("Editor: " + editor.id + " is now initialized.");
                        editor.on('input change undo redo', () => {
                            var content = editor.getContent()
                            _this.$emit('input', content);
                        });
                    },
                    plugins:[
                        "a11ychecker advcode advlist anchor autolink codesample colorpicker contextmenu fullscreen help image imagetools",
                        " lists link linkchecker media mediaembed noneditable powerpaste preview",
                        " searchreplace table template textcolor tinymcespellchecker visualblocks wordcount"
                    ]
                };
            Object.assign(setting,_this.setting);
            console.log("init tinymce");

            console.log(setting);
            tinymce.init(setting);
            $(".mce-container-body span.mce-label").remove();   
        },
        beforeDestroy: function () {
            tinymce.get(this.id).destroy();
        }
    }
    
</script>
