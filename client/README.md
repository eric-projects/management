# 开发指南

当前项目使用 Vue CLI 创建

语言：Typescript

组件库：Ant Design of Vue

## Ant Design 组件引入

在 `client/src/plugins/ant-design-vue.ts` 中注册所使用的组件，如果组件存在子组件也需要一并组册，以 `Menu` 组件为例：

```
import Vue from 'vue';
import { Menu } from 'ant-design-vue';
Vue.component(Menu.name, Menu);
Vue.component(Menu.Item.name, Menu.Item);
Vue.component(Menu.SubMenu.name, Menu.SubMenu);
```

## 如何使用 Typescript 编写 Vue 组件

### 1. data

可以和 Angular 一样，通过类中的一个属性来轻松使用

```typescript
@Component
export default class App extends Vue {
  title: string;
}
```

### 2. props

用于组件交互的对外属性可以通过 `@Prop` 声明，类似于 Angular 的 `@Input`

```typescript
@Component
export default class App extends Vue {
  @Prop() collapsed: boolean;
}
```

### 3. methods

方法的使用也可以和 Angular 一致

```typescript
@Component
export default class App extends Vue {
  onClick() {
    // todo
  }
}
```

### 4. 属性监听

通过 `@Watch` 可以对属性进行监听

```typescript
@Component
export default class App extends Vue {
  @Watch('collapsed') onChange(value: boolean, oldValue: boolean) {
    // todo
  }
}
```

### 5. 发射事件

通过 `@Emit` 可以将事件发射给父组件

```typescript
@Component
export default class App extends Vue {
  @Emit('collapseChanged') emitChange() {
    // todo
  }
}
```

## CSS Modules

由于采用了 `tsx` 编写 Vue，样式无法使用 `scoped`，采用 CSS Modules 作为替代方案

### 文件命名

我们不通过修改 `vue.config.js` 来配置 CSS Modules，而是通过文件名规则 `*.module.less` 来让 CLI 为我们开启 CSS Modules

样式推荐使用 `<组件名>.module.less` 命名，例如 `home.module.less`

### 样式类的编写和使用

**css**

```css
.home {
  color: #fff;
}
```

**tsx**

```typescript
import styles from './home.module.less';
```

**template**

```tsx
<div class={styles.home} />
```

注意，less 下类名可以嵌套，但是 css modules 名称不会嵌套

例如下方的写法，依然只需要使用 `styles.inner` 即可

```less
.home {
  color: #fff;

  .inner {
    color: #000;
  }
}
```

### 为什么不打开 CSS Modules 配置？

一旦配置打开，所有 css 都会被加入 modules，会导致三方类库样式失效

## Vue 生命周期列表

- beforeCreate

  > 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用

- created

  > 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，\$el 属性目前不可见。

- beforeMount

  > 在挂载开始之前被调用：相关的 render 函数首次被调用。

  > 该钩子在服务器端渲染期间不被调用。

- mounted

  > el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。

  > 该钩子在服务器端渲染期间不被调用。

- beforeUpdate

  > 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。

  > 该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。

- updated

  > 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

  > 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。

  > 该钩子在服务器端渲染期间不被调用。

- activated

  > keep-alive 组件激活时调用。

  > 该钩子在服务器端渲染期间不被调用。

- deactivated

  > keep-alive 组件停用时调用。

  > 该钩子在服务器端渲染期间不被调用。

- beforeDestroy

  > 实例销毁之前调用。在这一步，实例仍然完全可用。

  > 该钩子在服务器端渲染期间不被调用。

- destroyed

  > Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

  > 该钩子在服务器端渲染期间不被调用。

- errorCaptured

  > 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。
