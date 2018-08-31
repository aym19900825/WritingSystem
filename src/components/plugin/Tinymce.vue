<template>
    <div>
        <textarea :id="id" :value="value"></textarea>
        <div id="myMenu" v-show="isShow">
            <ul>
                <li @click="showSecNav(index,$event)" v-for="(item,index) in navMenu">{{item}}</li>
            </ul>
            <div class="menu-count" v-show="isSecShow">
                <div class="menu-count-list">
                    <ul>
                        <li v-for="item in secNav" @click="doSth($event)">
                            <span>{{item}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import tinymce from 'tinymce/tinymce';
    import 'tinymce/themes/modern/theme';
    import 'tinymce/plugins/paste';
    import 'tinymce/plugins/link';
    import Vue from 'vue'
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
                isShow: false,
                isSecShow: false,
                preDo: "",
                navMenu: [
                    '同义词替换',
                    '反义词替换',
                    '诗词插入',
                    '素材插入'
                ],

                mockData:{
                    synonym: [
                        '繁荣昌盛',
                        '繁荣富强',
                        '欣欣向荣',
                        '兴旺发达',
                        '蒸蒸日上',
                        '蓬勃发展',
                        '兴盛' 
                    ],
                    antonym: [
                        '贫弱',
                        '贫穷',
                        '国贫病弱',
                        '穷苦弱小',
                        '贫困',
                        '贫苦',
                        '缺少资产'
                    ],
                    poetry: [
                        '蒹葭苍苍，白露为霜。所谓伊人，在水一方。',
                        '氓之蚩蚩，抱布贸丝。匪来贸丝，来即我谋。',
                        '采薇采薇，薇亦作止。曰归曰归，岁亦莫止。',
                        '关关雎鸠，在河之洲。窈窕淑女，君子好逑。',
                        '靡家靡室，猃狁之故。不遑启居，猃狁之故。',
                        '采薇采薇，薇亦柔止。',
                        '静女其姝，俟我于城隅。爱而不见，搔首踟蹰。'
                    ],
                    material: [
                        '素材',
                        '素材',
                        '素材',
                        '素材',
                        '素材',
                        '素材',
                        '素材'
                    ]
                },

                secNav: [
                    '同义词',
                    '同义词',
                    '同义词',
                    '同义词',
                    '同义词',
                    '同义词',
                    '同义词'
                ]
            }
        },
        methods: {
            showSecNav(index,event){
                var thisDom = event.currentTarget;
                var txt = $(thisDom).text();
                var arr = [];

                switch(txt)
                    {
                    case '反义词替换':
                        arr = this.mockData.antonym;
                        break;
                    case '同义词替换':
                        arr = this.mockData.synonym;
                        break;
                    case '诗词插入':
                        arr = this.mockData.poetry;
                        break;
                    default:
                        arr = this.mockData.material;
                    }

                this.preDo = txt;
                this.secNav.splice(0,this.secNav.length,arr[0],arr[1],arr[2],arr[3],arr[4],arr[5],arr[6]);

                this.isSecShow = true;
                $(".menu-count").css({
                    top: 30*index
                });
            },
            //替换或者插入文本
            insertTiny(content){
                tinyMCE.execCommand("mceInsertContent", false, content); 
            },
            doSth(event){
                var thisDom = event.currentTarget;
                var content = $(thisDom).find("span").text();
                this.insertTiny(content);
                this.isShow = false;
                this.isSecShow = false;
            }
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
                            _this.isSecShow = false;
                        });
                    },
                    plugins:[]
                };
            Object.assign(setting,_this.setting)
            tinymce.init(setting);
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
}
#myMenu ul li{
    display:block;
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
.menu-count{
    position: absolute;
    width: 300px;
    left: 200px;
    top: 0px;
}
.menu-count-list{
    width: 100%;
    background: #fff;
    border: 1px solid #ccc;
}
.menu-count-list ul li{
    padding-left: 10px; 
    padding-right: 10px;    
    line-height: 30px;
}
.menu-count-list ul li span{
    width: 100%;
}
</style>
