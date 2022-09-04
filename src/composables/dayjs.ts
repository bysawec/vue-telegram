import * as dayjs from 'dayjs'
import * as Calendar from 'dayjs/plugin/calendar'// import plugin
import * as relativeTime from 'dayjs/plugin/relativeTime'// import plugin
import * as updateLocale from 'dayjs/plugin/updateLocale'// import plugin
import 'dayjs/locale/ru'
dayjs.extend(Calendar)
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)

dayjs.updateLocale('ru', {
  calendar: {
    lastDay: '[Вчера] HH:mm',
    sameDay: 'HH:mm',
    nextDay: '[Завтра в] HH:mm',
    lastWeek: 'DD MMMM HH:mm',
    nextWeek: 'dddd [в] HH:mm',
    sameElse: 'YYYY.MM.DD',
  },
})
dayjs.locale('ru')
export default dayjs
