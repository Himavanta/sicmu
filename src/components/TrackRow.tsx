import IconChevronDown from '@tabler/icons-vue/dist/esm/icons/IconChevronDown.mjs'
import IconChevronRight from '@tabler/icons-vue/dist/esm/icons/IconChevronRight.mjs'
import { defineComponent, type PropType } from 'vue'

import PlayingIndicator from './PlayingIndicator.tsx'

import style from './Row.module.scss'

export type RowMode = 'folder' | 'leaf'

export default defineComponent(
  (props) => {
    return () => {
      const isFolder = props.mode === 'folder'

      return (
        <div
          class={[style.row, props.active && style.rowActive, props.indent && style.rowIndent]
            .filter(Boolean)
            .join(' ')}
          title={props.artist ? `${props.title} — ${props.artist}` : props.title}
          onClick={() => props.onClick()}
        >
          {/* 索引列 */}
          <div class={style.index}>
            {isFolder ? (
              props.loading ? (
                <span class={style.spinner} />
              ) : props.expanded ? (
                <IconChevronDown size={14} />
              ) : (
                <IconChevronRight size={14} />
              )
            ) : (
              <PlayingIndicator
                playing={props.playing ?? false}
                loading={props.isLoading ?? false}
                index={props.index}
              />
            )}
          </div>

          {/* 标题 */}
          <span class={[style.title, props.active && style.titleActive].filter(Boolean).join(' ')}>
            {props.title}
          </span>

          {/* 元信息（仅 folder） */}
          {isFolder && props.pageCount != null && (
            <span class={style.meta}>{props.pageCount} 首</span>
          )}

          {/* 时长 */}
          <span class={style.duration}>{props.duration}</span>
        </div>
      )
    }
  },
  {
    props: {
      mode: { type: String as PropType<RowMode>, required: true },
      title: { type: String, required: true },
      duration: { type: String, required: true },
      index: { type: Number, required: true },
      active: { type: Boolean, required: true },
      pageCount: { type: Number },
      expanded: { type: Boolean },
      loading: { type: Boolean },
      playing: { type: Boolean },
      isLoading: { type: Boolean },
      artist: { type: String },
      indent: { type: Boolean, default: false },
      onClick: { type: Function as PropType<() => void>, required: true },
    },
  },
)
