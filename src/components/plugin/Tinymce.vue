<template>
    <div>
        <textarea :id="id" :value="value"></textarea>
        <div id="myMenu" v-show="isShow">
            <ul>
                <li class="synonym">同义词替换</li>
                <li class="antonym">反义词替换</li>
                <li>诗词插入</li>
            </ul>
        </div>
    </div>
    
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
                isShow: false
            }
        },
        methods: {
        },
        mounted: function () {
            const _this = this;
            const setting =
                {
                    selector:'#'+_this.id,
                    language_url: '../../static/tinymce/zh_CN.js',
                    init_instance_callback:function(editor) {
                        console.log($(".mce-container-body span.mce-label"));
                        $(".mce-container-body span.mce-label").remove();
                        
                        EDITOR = editor;
                        editor.on('input change undo redo', () => {
                            var content = editor.getContent()
                            _this.$emit('input', content);
                        });
                        editor.on('contextmenu',(e)=>{
                            _this.isShow = true;
                            $("#myMenu").css({
                                left: e.pageX+350,
                                top: e.pageY+100
                            });
                            return false;
                        });
                        editor.on('click',(e)=>{
                            _this.isShow = false;
                        });
                    },
                    plugins:[]
                };
            Object.assign(setting,_this.setting)
            tinymce.init(setting);


            $("#myMenu ul li").on("click",function(){
                 _this.isShow = false;
            });
        },
        beforeDestroy: function () {
            tinymce.get(this.id).destroy();
        }
    }
    
</script>
<style scoped>
#myMenu{
    width: 200px;
    border: 1px solid #ccc;
    position: absolute;
    background: #fff;
    padding-top: 5px;
    padding-bottom: 5px;
}
#myMenu ul li{
    display:block;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    padding-left: 30px;
    padding-right: 10px;
    text-align: left;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
}
#myMenu ul li:last-child{
    border-bottom: none;
}
#myMenu ul li:hover{
    background: #eee;
}
</style>
