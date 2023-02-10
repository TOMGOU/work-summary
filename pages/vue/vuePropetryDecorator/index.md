# vue-property-decorator

> https://github.com/kaorun343/vue-property-decorator

## 基本使用

```js
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
    chart: eCharts,
  }
})
export default class HorizontalContainer extends Vue{
  @Prop({default: () => ({})}) jsonSchema
  @PropSync('name', { type: String }) syncedName!: string

  handleDrop (e) {
    this.$emit('drop', e, this)
  }
}
```

## 装饰器详解

- @Prop
- @PropSync
- @Model
- @ModelSync
- @Watch
- @Provide
- @Inject
- @ProvideReactive
- @InjectReactive
- @Emit
- @Ref
- @VModel