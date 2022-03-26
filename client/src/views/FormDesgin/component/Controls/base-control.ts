import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
@Component
export class BaseControl extends Vue {
  @Prop() item!: any;
}
