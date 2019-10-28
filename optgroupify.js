(function($) {


    $.fn.optgroupify = function(initialSelection) {
        var $select = $(this);

        if ($select.get(0).tagName !== "SELECT" || $select.find("optgroup").length === 0) {
            console.error("optgroupify works only on grouped select elements",$select);
            return;
        }

        var lastSelection;

        if (!initialSelection) {

            lastSelection = {
                value: 0,
                dataPlaceholder: '',
                text: 'Bitte wählen Sie aus'
            };
        }

        var groups = [];

        $select.find("optgroup").each(function(key,optgroup) {
            var children = [];

            groups.push({
               label:  $(optgroup).attr('label'),
               children: children
            });

            $(optgroup).find("option").each(function(key2,option){
                var value = $(option).attr('value');
                var dataPlaceholder = $(option).attr('data-placeholder');
                var text = $(option).text();

                var element = { value : value, dataPlaceholder: dataPlaceholder, text: text };

                children.push(element);
            });

        });

        $select.setAndSelect = function(child) {
            $(this).empty();
            $(this).append("<option value='"+child.value+"' data-placeholder='"+child.dataPlaceholder+"' selected='selected'>"+child.text+"</option>");
            $(this).val(child.value);
            $(this).show();
            $(this).trigger('change', { automatic: true});
        };

        $select.getChildByValue = function(value){
            for(var g in groups){
                var group = groups[g].children;
                for(var c in group){
                    var child = group[c];
                    if(child.value === value) {
                        return child;
                    }
                }
            }

            return null;
        };

        $select.setAndSelectByValue = function(value){
            var child = $select.getChildByValue(value);
            $select.setAndSelect(child);
            lastSelection = child;
        };

        var $dropdown = $("<div></div>").attr('class','optgroupify');
        var $menu = $('<ul>');

        groups.forEach(function(group) {
            var $group = $('<li></li>');
            var $group_title = $('<a href="#">◂ '+group.label+'</a>');
            var $submenu = $('<ul></ul>');
            $group.append($group_title);
            $group.append($submenu);
            $group.hover(function() {
                $dropdown.find("ul ul").hide();
                $submenu.css('top',$group_title.position().top-20);
                $submenu.show();
            }, function() {
            });
            group.children.forEach(function(child) {
                var $item = $('<li><a href="#">'+child.text+'</a></li>');
                $submenu.append($item);
                /**$item.hover(function() {
                    $select.setAndSelect(child);
                    lastSelection = child;
                });*/

                $item.click(function() {
                    $select.setAndSelect(child);
                    lastSelection = child;
                    $dropdown.hide();

                    $select.trigger({ type: "selected", item: child});

                });
            });
            $menu.append($group);
        });

        $dropdown.append($menu);

        if(initialSelection){
            $select.setAndSelectByValue(initialSelection.value);
        }

        $select.setAndSelect(lastSelection);

        $select.after($dropdown);

        $dropdown.find("ul ul").mouseleave(function () {
            $dropdown.find("ul ul").hide();
        });


        $dropdown.hide();

        $select.on("mousedown",function(e) {
            e.preventDefault();

        });

        $select.on("mouseup",function(e){

            if ($dropdown.is(":visible")) {
                $dropdown.hide();
            } else {

                $select.empty();
                $select.hide();
                $dropdown.show();
                // This looks weird but is unfortunately necessary in order to active the ul as hoverable
                setTimeout(function () {
                    $select.setAndSelect(lastSelection);
                }, 0);
            }

            e.stopPropagation();
            e.preventDefault();
        });
    };

})(jQuery);
