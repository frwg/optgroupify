(function($) {


    $.fn.optgroupify = function() {
        var $select = $(this);

        if ($select.get(0).tagName !== "SELECT" || $select.find("optgroup").length === 0) {
            console.error("optgroupify works only on grouped select elements",$select);
            return;
        }

        var lastSelection = null;
        var groups = [];

        $select.find("optgroup").each(function(key,optgroup) {

            var children = [];

            groups.push({
               label:  $(optgroup).attr('label'),
               children: children
            });

            $(optgroup).find("option").each(function(key2,option){
                var value = $(option).attr('value');
                var text = $(option).text();

                var element = { value : value, text: text };

                children.push(element);
                lastSelection = lastSelection || element;
            });

        });

        $select.setAndSelect = function(child) {
            $(this).empty();
            $(this).append("<option value='"+child.value+"'>"+child.text+"</option>");
            $(this).val(child.value);
            $(this).show();
        };

        var $dropdown = $("<div></div>").attr('class','optgroupify');
        var $menu = $('<ul>');

        groups.forEach(function(group) {
            var $group = $('<li></li>');
            var $group_title = $('<a href="#">'+group.label+'</a>');
            var $submenu = $('<ul></ul>');
            $group.append($group_title);
            $group.append($submenu);
            $group.hover(function() {
                $dropdown.find("ul ul").hide();
                $submenu.css('top',$group_title.position().top-20);
                $submenu.show();
            });
            group.children.forEach(function(child) {
                var $item = $('<li><a href="#">'+child.text+'</a></li>');
                $submenu.append($item);
                $item.hover(function() {
                    $select.setAndSelect(child);
                    lastSelection = child;
                });

                $item.click(function() {
                    $dropdown.hide();
                });
            });
            $menu.append($group);
        });

        $dropdown.append($menu);
        $dropdown.mouseleave(function() {
            $dropdown.hide();
        });

        $select.after($dropdown);

        $dropdown.hide();

        $select.on("focus",function(e){
            $select.empty();
            $select.hide();
            $dropdown.show();
            // This looks weird but is unfortunately necessary in order to active the ul as hoverable
            setTimeout(function() {
               $select.setAndSelect(lastSelection);
            },0);

            e.stopPropagation();
            e.preventDefault();
        });

    };

})(jQuery);
