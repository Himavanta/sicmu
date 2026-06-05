## 编码规范

### 组件 Props 类型

props 类型**只写在 `options.props` 中一份**，`defineComponent` 的泛型会自动推断回调参数的 props 类型，不要在函数参数上重复标注。

基本类型（`String`/`Number`/`Boolean`）直接写，Vue 能自动推断；函数、联合类型、对象类型等必须用 `as PropType<T>` 显式标注。

```ts
// ✅ 正确：props 只声明一次，复杂类型加 PropType
export default defineComponent(
  (props) => {
    return () => <div>{props.title}</div>
  },
  {
    props: {
      title: { type: String, required: true },
      onClick: { type: Function as PropType<() => void>, required: true },
      mode: { type: String as PropType<RowMode>, required: true },
    },
  },
)

// ❌ 错误：函数参数重复标注类型
export default defineComponent(
  (props: { title: string; onClick: () => void; mode: RowMode }) => { ... },
  { props: { title: { type: String }, onClick: { type: Function as PropType<...> }, mode: { type: String as PropType<RowMode> } } },
)
```

无 props 的组件直接用单参数形式：`defineComponent(() => { ... })`
