$(function () {

    var user_id = null;

    var AJAX_INTERVAL = 10;
    var UPDATE_INTERVAL = 1;

    var utils_config = {
        hearbeat: 5000,
        sendCloseMessage: false,
        ws: {
            uri: ws_url('/utils-session/'),
            useSockJS: false,
            onconnected: function () {
            },
            ondisconnect: function () {
            },
            onreconnecting: function () {
            },
            onreconnected: function () {
            }
        },
        rpc: {
            requestTimeout: 15000
        }
    };

    var utils_client = new JsonRpcClient(utils_config);

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('_xsrf'));
            }
        }
    });

    function api_request(query, success, error, url) {
        $.ajax({
            url: url || window.public_api_url,
            type: 'POST',
            dataType: 'json',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({query: query}),
            success: success,
            error: error
        });
    }

    function service_match(serviceName) {
        return serviceName === window.service_name;
    }

    var services_metadata_query = " \
        query {                     \
            servicesMetadata {      \
              name,                 \
              title,                \
              description,          \
              iconClass,            \
              color,                \
              version,              \
              latestVersion,        \
              debug,                \
              publicApiUrl,         \
              uptime,               \
              logUrl                \
            }                       \
        }";

    var services_metadata_key = 'servicesMetadata';

    function update_services_registry() {
        api_request(
            services_metadata_query,
            function (result) {
                anthill_storage.setItem(services_metadata_key, result.data['servicesMetadata']);
            },
            function (jqXHR, textStatus, errorThrown) {
                anthill_storage.setItem(services_metadata_key, []);
            }
        );
    }

    // Build main sidebar services section.
    function update_sidebar_services() {
        var html_sidebar_data = '', html_sidebar_entry;
        var entries = anthill_storage.getItem(services_metadata_key);
        $.each(entries, function (index, entry) {
            var active = service_match(entry.name) ? 'active' : '';
            html_sidebar_entry =
                '<li class="navigation-service ' + active + '" data-name="' + entry.name + '">' +
                '    <a href="/services/' + entry.name + '/"><i class="' + entry.iconClass + '"></i> <span>' + entry.title + '</span></a>' +
                '</li>';
            html_sidebar_data += html_sidebar_entry;
        });
        if (anthill_storage.changed('html_sidebar_data', html_sidebar_data)) {
            $('.sidebar-main ul.navigation-main li.navigation-service').remove();
            $('.sidebar-main ul.navigation-main li.navigation-header-services').after(html_sidebar_data);
        }
    }

    // Update service
    $(document).on('click', '.services-cards__entry .update_service_action', function (e) {
        e.preventDefault();
        var $card = $(this).closest('.services-cards__entry');
        var service_name = $card.data('name') || window.service_name;
        swal({
                title: "Are you sure?",
                text: "Service " + service_name.toUpperCase() + " will be updated!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#EF5350",
                confirmButtonText: "Update",
                cancelButtonText: "Cancel",
                closeOnConfirm: false,
                closeOnCancel: true,
                showLoaderOnConfirm: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    var args = {service_name: service_name, version: null};
                    utils_client.send('update', args, function (error, response) {
                        if (error || response.error) {
                            var e = error || response.error;
                            swal({
                                title: "Error",
                                text: e.message,
                                confirmButtonColor: "#2196F3",
                                type: "error"
                            });
                        } else {
                            swal({
                                title: "Updated",
                                text: 'Restart service required!',
                                confirmButtonColor: "#66BB6A",
                                type: "success",
                                html: true
                            });
                        }
                    }, function () {

                    });
                }
            });
    });

    update_services_registry();
    setInterval(update_services_registry, AJAX_INTERVAL * 1000);
    setInterval(update_sidebar_services, UPDATE_INTERVAL * 1000);

    ion.sound({
        sounds: [
            {
                name: "button_tiny",
                alias: "incoming_message"
            }
        ],
        volume: 0.5,
        path: "/static/js/plugins/sounds/ion.sound/sounds/",
        preload: true
    });

    var messenger = io('http://localhost:9609/messenger', {
        query: {
            _xsrf: Cookies.get('_xsrf')
        }
    });

    // General event handlers
    messenger.on('connect', function () {
        // ¯\_(ツ)_/¯
    });
    messenger.on('disconnect', function () {
        // ¯\_(ツ)_/¯
    });
    messenger.on('create_message', function (data) {
        if (data.user.id !== user_id) { // Filter out own messages
            ion.sound.play("incoming_message");
        }
    });

    var timer = new easytimer.Timer();
    var uptime = window.service_uptime;

    function updateUptime() {
        var newValue = timer.getTimeValues().toString();
        var data = '<i class="icon-history text-warning position-left"></i> ' + newValue;
        $('#navbar-uptime .heading-text').html(data);
    }

    timer.start({precision: 'seconds', startValues: {seconds: uptime}});

    updateUptime();
    timer.addEventListener('secondsUpdated', function (e) {
        updateUptime();
    });

});