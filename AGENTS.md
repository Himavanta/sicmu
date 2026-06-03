<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

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
