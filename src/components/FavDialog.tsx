import IconFolder from '@tabler/icons-vue/dist/esm/icons/IconFolder.mjs'
import IconX from '@tabler/icons-vue/dist/esm/icons/IconX.mjs'
import { useQuery } from '@tanstack/vue-query'
import { defineComponent, type PropType, computed } from 'vue'

import {
  getCurrentUserMid,
  getCreatedFavFolders,
  getCollectedFavFolders,
  getFavResources,
  getSeasonResources,
} from '../api/index.ts'
import type { FavFolder, FavResource } from '../api/index.ts'
import { state, play } from '../stores/index.ts'
import type { Song } from '../stores/types.ts'

import style from './FavDialog.module.scss'

export default defineComponent(
  (props) => {
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

    async function handleFolderClick(folder: FavFolder) {
      let resources: FavResource[]
      try {
        if (folder.type === 21 && folder.ownerMid) {
          resources = await getSeasonResources(folder.id, folder.ownerMid)
        } else {
          resources = await getFavResources(folder.id)
        }
      } catch (e) {
        console.error('获取内容失败:', e)
        return
      }
      if (resources.length === 0) return

      const songs: Song[] = resources.map((r) => {
        const pages =
          r.pageCount > 1
            ? Array.from({ length: r.pageCount }, () => ({
                cid: 0,
                title: '加载中…',
                duration: 0,
              }))
            : []
        return {
          id: r.bvid,
          bvid: r.bvid,
          title: r.title,
          artist: r.upperName,
          duration: r.duration,
          pic: '',
          cid: 0,
          pages,
          currentPageIndex: 0,
        }
      })

      state.playlist.splice(0, state.playlist.length, ...songs)

      // 直接播第一首
      await play(0)

      props.onPlaylistUpdated?.()
      props.onClose()
    }

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
                      <div class={style.folder} key={f.id} onClick={() => handleFolderClick(f)}>
                        <div class={style.folderIcon}>
                          <IconFolder size={18} />
                        </div>
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
                      <div class={style.folder} key={f.id} onClick={() => handleFolderClick(f)}>
                        {f.cover ? (
                          <img
                            class={style.folderCover}
                            src={f.cover}
                            alt={f.title}
                            referrerpolicy='origin'
                          />
                        ) : (
                          <div class={style.folderIcon}>
                            <IconFolder size={18} />
                          </div>
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
      onPlaylistUpdated: { type: Function as PropType<() => void> },
    },
  },
)
