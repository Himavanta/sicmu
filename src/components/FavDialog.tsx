import IconX from '@tabler/icons-vue/dist/esm/icons/IconX.mjs'
import { defineComponent, type PropType, ref, onMounted } from 'vue'

import type { FavFolder } from '../state/api.ts'
import { getCurrentUserMid, getCreatedFavFolders, getCollectedFavFolders } from '../state/index.ts'

import style from './FavDialog.module.scss'

export default defineComponent(
  (props: { onClose: () => void }) => {
    const created = ref<FavFolder[]>([])
    const collected = ref<FavFolder[]>([])
    const loading = ref(true)

    onMounted(async () => {
      try {
        const mid = await getCurrentUserMid()
        const [c, col] = await Promise.all([getCreatedFavFolders(mid), getCollectedFavFolders(mid)])
        created.value = c
        collected.value = col
      } catch (e) {
        console.error('获取收藏夹失败:', e)
      } finally {
        loading.value = false
      }
    })

    return () => (
      <div class={style.backdrop} onClick={() => props.onClose()}>
        <div class={style.dialog} onClick={(e: MouseEvent) => e.stopPropagation()}>
          <div class={style.header}>
            <span>添加来源</span>
            <button class={style.closeBtn} onClick={() => props.onClose()}>
              <IconX size={18} />
            </button>
          </div>

          <div class={style.content}>
            {loading.value ? (
              <div class={style.loading}>加载中…</div>
            ) : (
              <>
                {/* ── 我的收藏夹 ── */}
                <div class={style.section}>
                  <div class={style.sectionTitle}>我的收藏夹</div>
                  {created.value.length === 0 ? (
                    <div class={style.empty}>暂无收藏夹</div>
                  ) : (
                    created.value.map((f) => (
                      <div class={style.folder} key={f.id}>
                        <div class={style.folderCover} />
                        <div class={style.folderInfo}>
                          <div class={style.folderTitle}>{f.title}</div>
                          <div class={style.folderMeta}>{f.mediaCount} 个内容</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* ── 订阅的收藏夹 ── */}
                <div class={style.section}>
                  <div class={style.sectionTitle}>订阅的收藏夹</div>
                  {collected.value.length === 0 ? (
                    <div class={style.empty}>暂无订阅</div>
                  ) : (
                    collected.value.map((f) => (
                      <div class={style.folder} key={f.id}>
                        {f.cover ? (
                          <img
                            class={style.folderCover}
                            src={f.cover}
                            alt={f.title}
                            referrerpolicy='no-referrer'
                          />
                        ) : (
                          <div class={style.folderCover} />
                        )}
                        <div class={style.folderInfo}>
                          <div class={style.folderTitle}>{f.title}</div>
                          <div class={style.folderMeta}>
                            {f.mediaCount} 个内容{f.upperName ? ` · ${f.upperName}` : ''}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  },
  {
    props: {
      onClose: { type: Function as PropType<() => void>, required: true },
    },
  },
)
