export default class Popup {
    constructor(parent, popup_func, gantt) {
        this.parent = parent;
        this.popup_func = popup_func;
        this.gantt = gantt;

        this.make();
    }

    make() {
        this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="details"></div>
            <div class="actions"></div>
        `;
        this.hide();

        this.title = this.parent.querySelector('.title');
        this.subtitle = this.parent.querySelector('.subtitle');
        this.details = this.parent.querySelector('.details');
        this.actions = this.parent.querySelector('.actions');
    }

    show({ x, y, task, target, container}) {
        this.actions.innerHTML = '';
        let html = this.popup_func({
            task,
            chart: this.gantt,
            get_title: () => this.title,
            set_title: (title) => (this.title.innerHTML = title),
            get_subtitle: () => this.subtitle,
            set_subtitle: (subtitle) => (this.subtitle.innerHTML = subtitle),
            get_details: () => this.details,
            set_details: (details) => (this.details.innerHTML = details),
            add_action: (html, func) => {
                let action = this.gantt.create_el({
                    classes: 'action-btn',
                    type: 'button',
                    append_to: this.actions,
                });
                if (typeof html === 'function') html = html(task);
                action.innerHTML = html;
                action.onclick = (e) => func(task, this.gantt, e);
            },
        });
        if (html === false) return;
        if (html) this.parent.innerHTML = html;

        if (this.actions.innerHTML === '') this.actions.remove();
        else this.parent.appendChild(this.actions);
        this.parent.classList.remove('hide');
        
        // after render
        let left = x + 10;
        let top = y - 10;
        let height = this.parent.clientHeight;
        let width = this.parent.clientWidth;
        const maxHeight = container.clientHeight + container.scrollTop;
        const maxWidth = container.clientWidth + container.scrollLeft;
        if (top + height > maxHeight - 10) { // 화면을 넘어서면 - 하단
            top = maxHeight - height - 10;
        }
        this.parent.style.top = top + 'px'
        if (left + width > maxWidth - 10) { // 화면을 넘어서면 - 우측
            left = maxWidth - width - 10;
        }
        this.parent.style.left = left + 'px'
    }

    hide() {
        this.parent.classList.add('hide');
    }
}
