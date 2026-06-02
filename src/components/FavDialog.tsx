import IconX from '@tabler/icons-vue/dist/esm/icons/IconX.mjs'
import { useQuery } from '@tanstack/vue-query'
import { defineComponent, type PropType, computed } from 'vue'

import { getCurrentUserMid, getCreatedFavFolders, getCollectedFavFolders } from '../api/index.ts'

import style from './FavDialog.module.scss'

export default defineComponent(
  (props: { onClose: () => void }) => {
    const midQuery = useQuery({
      queryKey: ['user-mid'],
      queryFn: getCurrentUserMid,
      staleTime: 5 * 60 * 1000,
    })

    const createdQuery = useQuery({
      queryKey: ['fav-folders', 'created', midQuery.data.value],
      queryFn: () => getCreatedFavFolders(midQuery.data.value!),
      enabled: computed(() => !!midQuery.data.value),
      retry: 1,
    })

    const collectedQuery = useQuery({
      queryKey: ['fav-folders', 'collected', midQuery.data.value],
      queryFn: () => getCollectedFavFolders(midQuery.data.value!),
      enabled: computed(() => !!midQuery.data.value),
      retry: 1,
    })

    const loading = computed(
      () =>
        midQuery.isLoading.value || createdQuery.isLoading.value || collectedQuery.isLoading.value,
    )

    return () => (
      <div class={style.backdrop} onClick={() => props.onClose()}>
        <div class={style.dialog} onClick={(e: MouseEvent) => e.stopPropagation()}>
          <div class={style.header}>
            <span>添加来源</span>
            <button class={style.closeBtn} onClick={() => props.onClose()}>
              <IconX size={16} />
            </button>
          </div>

          <div class={style.content}>
            {loading.value ? (
              <div class={style.loading}>
                <span class={style.loadingDot} />
                加载中
              </div>
            ) : (
              <>
                <div class={style.section}>
                  <div class={style.sectionLabel}>我的收藏夹</div>
                  {createdQuery.data.value?.length === 0 ? (
                    <div class={style.empty}>暂无收藏夹</div>
                  ) : (
                    createdQuery.data.value?.map((f) => (
                      <div class={style.folder} key={f.id}>
                        <div class={style.folderCover} />
                        <div class={style.folderInfo}>
                          <div class={style.folderTitle}>{f.title}</div>
                          <div class={style.folderMeta}>{f.mediaCount} 项</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div class={style.section}>
                  <div class={style.sectionLabel}>订阅</div>
                  {collectedQuery.data.value?.length === 0 ? (
                    <div class={style.empty}>暂无订阅</div>
                  ) : (
                    collectedQuery.data.value?.map((f) => (
                      <div class={style.folder} key={f.id}>
                        {f.cover ? (
                          <img
                            class={style.folderCover}
                            src={f.cover}
                            alt={f.title}
                            referrerpolicy='origin'
                          />
                        ) : (
                          <div class={style.folderCover} />
                        )}
                        <div class={style.folderInfo}>
                          <div class={style.folderTitle}>{f.title}</div>
                          <div class={style.folderMeta}>
                            {f.mediaCount} 项{f.upperName ? ` · ${f.upperName}` : ''}
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
